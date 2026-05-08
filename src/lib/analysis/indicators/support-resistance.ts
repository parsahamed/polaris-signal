import type { SupportResistanceAnalysis } from "@/types/analysis.types";
import type { CandlePoint } from "@/types/chart.types";

function roundPrice(value: number): number {
  if (value >= 100) {
    return Math.round(value);
  }

  return Number(value.toFixed(2));
}

export function detectSupportResistance(
  candles: CandlePoint[],
): SupportResistanceAnalysis {
  const recentCandles = candles.slice(-40);

  if (recentCandles.length < 5) {
    return {};
  }

  const localLows: number[] = [];
  const localHighs: number[] = [];

  for (let index = 1; index < recentCandles.length - 1; index += 1) {
    const previous = recentCandles[index - 1];
    const current = recentCandles[index];
    const next = recentCandles[index + 1];

    if (current.low <= previous.low && current.low <= next.low) {
      localLows.push(current.low);
    }

    if (current.high >= previous.high && current.high >= next.high) {
      localHighs.push(current.high);
    }
  }

  const lows = localLows.length > 0 ? localLows : recentCandles.map((c) => c.low);
  const highs =
    localHighs.length > 0 ? localHighs : recentCandles.map((c) => c.high);

  return {
    support: roundPrice(Math.min(...lows)),
    resistance: roundPrice(Math.max(...highs)),
  };
}
