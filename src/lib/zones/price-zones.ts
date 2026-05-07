import type { PriceZone } from "@/types/market-analysis.types";

function roundZoneValue(value: number): number {
  const precision = value >= 100 ? 0 : 2;
  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
}

export function calculatePriceZones(price: number): PriceZone {
  return {
    support: roundZoneValue(price * 0.96),
    resistance: roundZoneValue(price * 1.04),
  };
}
