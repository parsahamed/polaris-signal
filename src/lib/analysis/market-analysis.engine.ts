import { detectBreakout } from "@/lib/analysis/indicators/breakout";
import { analyzeMarketStructure } from "@/lib/analysis/indicators/market-structure";
import { calculateSMA } from "@/lib/analysis/indicators/sma";
import { detectSupportResistance } from "@/lib/analysis/indicators/support-resistance";
import { detectTrend } from "@/lib/analysis/indicators/trend";
import { calculateTrendStrength } from "@/lib/analysis/indicators/trend-strength";
import { analyzeVolumeConfirmation } from "@/lib/analysis/indicators/volume-confirmation";
import { calculateVolatility } from "@/lib/analysis/indicators/volatility";
import { summarizeTimeframeAnalysis } from "@/lib/analysis/timeframe-summary";
import type { MarketTechnicalAnalysis } from "@/types/analysis.types";
import type { CandlePoint, ChartTimeframe } from "@/types/chart.types";

interface AnalyzeCandlesInput {
  symbol: string;
  candles: CandlePoint[];
  timeframe?: ChartTimeframe;
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

function buildReasons(analysis: MarketTechnicalAnalysis): string[] {
  const {
    breakout,
    currentPrice,
    marketStructure,
    movingAverages,
    supportResistance,
    trend,
    trendStrength,
    volume,
  } = analysis;

  if (currentPrice === 0) {
    return ["Real candle data is unavailable for this market."];
  }

  if (marketStructure.structure === "insufficient-data") {
    return [
      "Not enough real candle history is available for reliable market structure analysis.",
    ];
  }

  const reasons: string[] = [];

  if (movingAverages.sma25 !== undefined) {
    if (currentPrice > movingAverages.sma25) {
      reasons.push("Price is trading above SMA25");
    } else if (currentPrice < movingAverages.sma25) {
      reasons.push("Price is below SMA25");
    }
  }

  if (
    movingAverages.sma7 !== undefined &&
    movingAverages.sma25 !== undefined
  ) {
    if (movingAverages.sma7 > movingAverages.sma25) {
      reasons.push("Short-term momentum is positive");
    } else if (movingAverages.sma7 < movingAverages.sma25) {
      reasons.push("Short-term momentum is negative");
    }
  }

  if (marketStructure.structure === "higher-highs-higher-lows") {
    reasons.push("Recent structure shows higher highs and higher lows");
  }

  if (marketStructure.structure === "lower-highs-lower-lows") {
    reasons.push("Recent structure shows lower highs and lower lows");
  }

  if (marketStructure.structure === "mixed") {
    reasons.push("Short-term structure is mixed");
  }

  if (marketStructure.structure === "sideways") {
    reasons.push("Market structure is sideways");
  }

  if (breakout.direction === "breakout-up") {
    reasons.push("Breakout above resistance detected");
  }

  if (breakout.direction === "breakout-down") {
    reasons.push("Breakdown below support detected");
  }

  if (
    trend === "neutral" &&
    supportResistance.support !== undefined &&
    supportResistance.resistance !== undefined &&
    currentPrice > supportResistance.support &&
    currentPrice < supportResistance.resistance
  ) {
    reasons.push("Price is consolidating between support and resistance");
  }

  if (volume.confirmation === "confirmed") {
    reasons.push("Volume confirms the recent move");
  }

  if (volume.confirmation === "weak") {
    reasons.push("Volume confirmation is weak");
  }

  reasons.push(`Trend strength is ${trendStrength.strength}`);

  if (reasons.length === 0) {
    reasons.push("Market structure is mixed across recent candles");
  }

  return reasons;
}

export function analyzeCandles({
  symbol,
  candles,
  timeframe = "1D",
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
  const marketStructure = analyzeMarketStructure(sortedCandles);
  const breakout = detectBreakout({
    candles: sortedCandles,
    support: supportResistance.support,
    resistance: supportResistance.resistance,
  });
  const trendStrength = calculateTrendStrength({
    trend,
    movingAverages,
    marketStructure,
    candles: sortedCandles,
  });
  const volume = analyzeVolumeConfirmation(sortedCandles);

  const analysisWithoutReasons: Omit<MarketTechnicalAnalysis, "reasons" | "summary"> = {
    symbol,
    currentPrice: roundPrice(currentPrice),
    movingAverages,
    supportResistance,
    volatility,
    trend,
    marketStructure,
    breakout,
    trendStrength,
    volume,
  };
  const analysisWithSummaryInput: MarketTechnicalAnalysis = {
    ...analysisWithoutReasons,
    summary: "",
    reasons: [],
  };
  const summary = summarizeTimeframeAnalysis({
    timeframe,
    analysis: analysisWithSummaryInput,
  }).summary;
  const analysis: MarketTechnicalAnalysis = {
    ...analysisWithoutReasons,
    summary,
    reasons: [],
  };

  return {
    ...analysis,
    reasons: buildReasons(analysis),
  };
}
