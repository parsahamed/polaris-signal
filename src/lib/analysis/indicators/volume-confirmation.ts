import type { VolumeAnalysis } from "@/types/analysis.types";
import type { CandlePoint } from "@/types/chart.types";

function average(values: number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function roundVolume(value: number): number {
  return Number(value.toFixed(2));
}

export function analyzeVolumeConfirmation(
  candles: CandlePoint[],
): VolumeAnalysis {
  const candlesWithVolume = candles.filter((candle) => {
    return candle.volume !== undefined && Number.isFinite(candle.volume);
  });

  if (candlesWithVolume.length < 25) {
    return { confirmation: "unavailable" };
  }

  const recentVolumes = candlesWithVolume.slice(-5).map((candle) => {
    return candle.volume ?? 0;
  });
  const previousVolumes = candlesWithVolume.slice(-25, -5).map((candle) => {
    return candle.volume ?? 0;
  });
  const recentVolume = average(recentVolumes);
  const averageVolume = average(previousVolumes);

  return {
    confirmation:
      averageVolume > 0 && recentVolume > averageVolume * 1.15
        ? "confirmed"
        : "weak",
    recentVolume: roundVolume(recentVolume),
    averageVolume: roundVolume(averageVolume),
  };
}
