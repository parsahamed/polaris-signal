import type { CandlePoint } from "@/types/chart.types";

export type VolatilityLevel = "low" | "medium" | "high";

export function calculateVolatility(candles: CandlePoint[]): VolatilityLevel {
  const recentCandles = candles.slice(-20).filter((candle) => candle.close > 0);

  if (recentCandles.length === 0) {
    return "low";
  }

  const averageRange =
    recentCandles.reduce((total, candle) => {
      return total + (candle.high - candle.low) / candle.close;
    }, 0) / recentCandles.length;

  if (averageRange < 0.015) {
    return "low";
  }

  if (averageRange < 0.04) {
    return "medium";
  }

  return "high";
}
