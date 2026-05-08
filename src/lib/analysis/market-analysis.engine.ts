import { calculateSMA } from "@/lib/analysis/indicators/sma";
import { detectSupportResistance } from "@/lib/analysis/indicators/support-resistance";
import { detectTrend } from "@/lib/analysis/indicators/trend";
import { calculateVolatility } from "@/lib/analysis/indicators/volatility";
import type { MarketTechnicalAnalysis } from "@/types/analysis.types";
import type { CandlePoint } from "@/types/chart.types";

interface AnalyzeCandlesInput {
  symbol: string;
  candles: CandlePoint[];
}

function lastFinite(values: number[]): number | undefined {
  return values.findLast((value) => Number.isFinite(value));
}

function roundPrice(value: number): number {
  if (value >= 100) {
    return Math.round(value);
  }

  return Number(value.toFixed(2));
}

function hasHigherLows(candles: CandlePoint[]): boolean {
  const recent = candles.slice(-10);

  if (recent.length < 6) {
    return false;
  }

  const midpoint = Math.floor(recent.length / 2);
  const firstHalfLow = Math.min(...recent.slice(0, midpoint).map((c) => c.low));
  const secondHalfLow = Math.min(...recent.slice(midpoint).map((c) => c.low));

  return secondHalfLow > firstHalfLow;
}

function hasLowerHighs(candles: CandlePoint[]): boolean {
  const recent = candles.slice(-10);

  if (recent.length < 6) {
    return false;
  }

  const midpoint = Math.floor(recent.length / 2);
  const firstHalfHigh = Math.max(
    ...recent.slice(0, midpoint).map((c) => c.high),
  );
  const secondHalfHigh = Math.max(...recent.slice(midpoint).map((c) => c.high));

  return secondHalfHigh < firstHalfHigh;
}

function buildReasons(input: {
  candles: CandlePoint[];
  currentPrice: number;
  sma7?: number;
  sma25?: number;
  trend: MarketTechnicalAnalysis["trend"];
  support?: number;
  resistance?: number;
}): string[] {
  const { candles, currentPrice, sma7, sma25, trend, support, resistance } =
    input;

  if (candles.length === 0) {
    return ["Real candle data is unavailable for this market."];
  }

  if (candles.length < 25) {
    return ["Not enough real candle history is available for reliable analysis."];
  }

  const reasons: string[] = [];

  if (sma25 !== undefined) {
    if (currentPrice > sma25) {
      reasons.push("Price is trading above SMA25");
    } else if (currentPrice < sma25) {
      reasons.push("Price is below SMA25");
    }
  }

  if (sma7 !== undefined && sma25 !== undefined) {
    if (sma7 > sma25) {
      reasons.push("Short-term momentum is positive");
    } else if (sma7 < sma25) {
      reasons.push("Short-term momentum is negative");
    }
  }

  if (trend === "bullish" && hasHigherLows(candles)) {
    reasons.push("Recent candles show higher lows");
  }

  if (trend === "bearish" && hasLowerHighs(candles)) {
    reasons.push("Recent candles show lower highs");
  }

  if (
    trend === "neutral" &&
    support !== undefined &&
    resistance !== undefined &&
    currentPrice > support &&
    currentPrice < resistance
  ) {
    reasons.push("Price is consolidating between support and resistance");
  }

  if (reasons.length === 0) {
    reasons.push("Market structure is mixed across recent candles");
  }

  return reasons;
}

export function analyzeCandles({
  symbol,
  candles,
}: AnalyzeCandlesInput): MarketTechnicalAnalysis {
  const sortedCandles = [...candles].sort((first, second) => {
    return first.time - second.time;
  });
  const closes = sortedCandles.map((candle) => candle.close);
  const currentPrice = closes.at(-1) ?? 0;
  const sma7 = lastFinite(calculateSMA(closes, 7));
  const sma25 = lastFinite(calculateSMA(closes, 25));
  const sma99 = lastFinite(calculateSMA(closes, 99));
  const supportResistance = detectSupportResistance(sortedCandles);
  const volatility = calculateVolatility(sortedCandles);
  const trend = detectTrend({ closes, price: currentPrice });

  const movingAverages = {
    ...(sma7 !== undefined ? { sma7: roundPrice(sma7) } : {}),
    ...(sma25 !== undefined ? { sma25: roundPrice(sma25) } : {}),
    ...(sma99 !== undefined ? { sma99: roundPrice(sma99) } : {}),
  };

  return {
    symbol,
    currentPrice: roundPrice(currentPrice),
    movingAverages,
    supportResistance,
    volatility,
    trend,
    reasons: buildReasons({
      candles: sortedCandles,
      currentPrice,
      sma7,
      sma25,
      trend,
      support: supportResistance.support,
      resistance: supportResistance.resistance,
    }),
  };
}
