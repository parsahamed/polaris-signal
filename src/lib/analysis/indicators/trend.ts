import { calculateSMA } from "@/lib/analysis/indicators/sma";

export type TrendDirection = "bullish" | "bearish" | "neutral";

interface DetectTrendInput {
  closes: number[];
  price?: number;
}

function lastFinite(values: number[]): number | undefined {
  return values.findLast((value) => Number.isFinite(value));
}

export function detectTrend({ closes, price }: DetectTrendInput): TrendDirection {
  if (closes.length < 25) {
    return "neutral";
  }

  const currentPrice = price ?? closes.at(-1);
  const sma7 = lastFinite(calculateSMA(closes, 7));
  const sma25 = lastFinite(calculateSMA(closes, 25));

  if (
    currentPrice === undefined ||
    sma7 === undefined ||
    sma25 === undefined
  ) {
    return "neutral";
  }

  if (sma7 > sma25 && currentPrice > sma25) {
    return "bullish";
  }

  if (sma7 < sma25 && currentPrice < sma25) {
    return "bearish";
  }

  return "neutral";
}
