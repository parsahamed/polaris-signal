import type {
  MarketStructureAnalysis,
  MovingAverageAnalysis,
  TrendStrengthAnalysis,
} from "@/types/analysis.types";
import type { CandlePoint } from "@/types/chart.types";
import type { TrendDirection } from "@/lib/analysis/indicators/trend";

interface CalculateTrendStrengthInput {
  trend: TrendDirection;
  movingAverages: MovingAverageAnalysis;
  marketStructure: MarketStructureAnalysis;
  candles: CandlePoint[];
}

function recentMomentumConfirms(
  trend: TrendDirection,
  candles: CandlePoint[],
): boolean {
  const recent = candles.slice(-5);

  if (recent.length < 5) {
    return false;
  }

  const firstClose = recent[0].close;
  const lastClose = recent.at(-1)?.close;

  if (lastClose === undefined) {
    return false;
  }

  if (trend === "bullish") {
    return lastClose > firstClose;
  }

  if (trend === "bearish") {
    return lastClose < firstClose;
  }

  return false;
}

export function calculateTrendStrength({
  trend,
  movingAverages,
  marketStructure,
  candles,
}: CalculateTrendStrengthInput): TrendStrengthAnalysis {
  if (trend === "neutral" || candles.length < 25) {
    return { strength: "weak", score: 0 };
  }

  const latestClose = candles.at(-1)?.close;
  let score = 0;

  if (latestClose !== undefined && movingAverages.sma25 !== undefined) {
    if (trend === "bullish" && latestClose > movingAverages.sma25) {
      score += 25;
    }

    if (trend === "bearish" && latestClose < movingAverages.sma25) {
      score += 25;
    }
  }

  if (
    movingAverages.sma7 !== undefined &&
    movingAverages.sma25 !== undefined
  ) {
    if (trend === "bullish" && movingAverages.sma7 > movingAverages.sma25) {
      score += 25;
    }

    if (trend === "bearish" && movingAverages.sma7 < movingAverages.sma25) {
      score += 25;
    }
  }

  if (
    trend === "bullish" &&
    marketStructure.structure === "higher-highs-higher-lows"
  ) {
    score += 30;
  }

  if (
    trend === "bearish" &&
    marketStructure.structure === "lower-highs-lower-lows"
  ) {
    score += 30;
  }

  if (recentMomentumConfirms(trend, candles)) {
    score += 20;
  }

  if (score >= 70) {
    return { strength: "strong", score };
  }

  if (score >= 40) {
    return { strength: "moderate", score };
  }

  return { strength: "weak", score };
}
