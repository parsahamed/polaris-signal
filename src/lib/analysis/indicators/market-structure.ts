import { detectSwingPoints } from "@/lib/analysis/indicators/swing-points";
import type {
  MarketStructure,
  MarketStructureAnalysis,
  SwingPoint,
} from "@/types/analysis.types";
import type { CandlePoint } from "@/types/chart.types";

function countRising(points: SwingPoint[]): number {
  return points.reduce((count, point, index) => {
    if (index === 0) {
      return count;
    }

    return point.price > points[index - 1].price ? count + 1 : count;
  }, 0);
}

function countFalling(points: SwingPoint[]): number {
  return points.reduce((count, point, index) => {
    if (index === 0) {
      return count;
    }

    return point.price < points[index - 1].price ? count + 1 : count;
  }, 0);
}

function classifyStructure(input: {
  swingHighs: SwingPoint[];
  swingLows: SwingPoint[];
  higherHighsCount: number;
  higherLowsCount: number;
  lowerHighsCount: number;
  lowerLowsCount: number;
}): MarketStructure {
  const {
    swingHighs,
    swingLows,
    higherHighsCount,
    higherLowsCount,
    lowerHighsCount,
    lowerLowsCount,
  } = input;

  if (swingHighs.length < 2 || swingLows.length < 2) {
    return "insufficient-data";
  }

  const bullishCount = higherHighsCount + higherLowsCount;
  const bearishCount = lowerHighsCount + lowerLowsCount;
  const totalComparisons = swingHighs.length + swingLows.length - 2;

  if (bullishCount >= 3 && bullishCount >= totalComparisons * 0.6) {
    return "higher-highs-higher-lows";
  }

  if (bearishCount >= 3 && bearishCount >= totalComparisons * 0.6) {
    return "lower-highs-lower-lows";
  }

  if (Math.abs(bullishCount - bearishCount) <= 1) {
    return "sideways";
  }

  return "mixed";
}

export function analyzeMarketStructure(
  candles: CandlePoint[],
): MarketStructureAnalysis {
  const recentCandles = candles.slice(-80);
  const { swingHighs, swingLows } = detectSwingPoints(recentCandles, 2);
  const higherHighsCount = countRising(swingHighs);
  const higherLowsCount = countRising(swingLows);
  const lowerHighsCount = countFalling(swingHighs);
  const lowerLowsCount = countFalling(swingLows);

  return {
    structure: classifyStructure({
      swingHighs,
      swingLows,
      higherHighsCount,
      higherLowsCount,
      lowerHighsCount,
      lowerLowsCount,
    }),
    swingHighs,
    swingLows,
    higherHighsCount,
    higherLowsCount,
    lowerHighsCount,
    lowerLowsCount,
  };
}
