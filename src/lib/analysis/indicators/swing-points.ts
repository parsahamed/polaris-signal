import type { CandlePoint } from "@/types/chart.types";
import type { SwingPoint } from "@/types/analysis.types";

interface SwingPointsResult {
  swingHighs: SwingPoint[];
  swingLows: SwingPoint[];
}

export function detectSwingPoints(
  candles: CandlePoint[],
  lookback = 2,
): SwingPointsResult {
  const swingHighs: SwingPoint[] = [];
  const swingLows: SwingPoint[] = [];

  if (candles.length < lookback * 2 + 1) {
    return { swingHighs, swingLows };
  }

  for (let index = lookback; index < candles.length - lookback; index += 1) {
    const current = candles[index];
    const neighbors = [
      ...candles.slice(index - lookback, index),
      ...candles.slice(index + 1, index + lookback + 1),
    ];
    const isSwingHigh = neighbors.every((candle) => current.high > candle.high);
    const isSwingLow = neighbors.every((candle) => current.low < candle.low);

    if (isSwingHigh) {
      swingHighs.push({
        index,
        time: current.time,
        price: current.high,
        type: "high",
      });
    }

    if (isSwingLow) {
      swingLows.push({
        index,
        time: current.time,
        price: current.low,
        type: "low",
      });
    }
  }

  return { swingHighs, swingLows };
}
