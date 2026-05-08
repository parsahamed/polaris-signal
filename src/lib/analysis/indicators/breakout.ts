import type { BreakoutAnalysis } from "@/types/analysis.types";
import type { CandlePoint } from "@/types/chart.types";

interface DetectBreakoutInput {
  candles: CandlePoint[];
  support?: number;
  resistance?: number;
}

function roundPercent(value: number): number {
  return Number(value.toFixed(2));
}

export function detectBreakout({
  candles,
  support,
  resistance,
}: DetectBreakoutInput): BreakoutAnalysis {
  const latestClose = candles.at(-1)?.close;

  if (!latestClose) {
    return { direction: "no-breakout" };
  }

  if (resistance !== undefined) {
    const distancePercent = ((latestClose - resistance) / resistance) * 100;

    if (distancePercent >= 0.3) {
      return {
        direction: "breakout-up",
        level: resistance,
        distancePercent: roundPercent(distancePercent),
      };
    }
  }

  if (support !== undefined) {
    const distancePercent = ((support - latestClose) / support) * 100;

    if (distancePercent >= 0.3) {
      return {
        direction: "breakout-down",
        level: support,
        distancePercent: roundPercent(distancePercent),
      };
    }
  }

  return { direction: "no-breakout" };
}
