import { analyzeMarket } from "@/lib/services/market-analysis.service";
import type { MarketAnalysisResult } from "@/types/market-analysis.types";
import type { Market } from "@/types/market.types";
import type { SignalStatus } from "@/types/signal.types";

const basePriceByCategory: Record<Market["category"], number> = {
  crypto: 42000,
  gold: 2400,
  forex: 1,
  "iran-market": 59000,
};

export const signalLabels: Record<SignalStatus, string> = {
  bullish: "Bullish",
  neutral: "Neutral",
  bearish: "Bearish",
  danger: "Danger",
};

export function generateMockPrice(market: Market): number {
  const multiplier = 0.85 + Math.random() * 0.3;

  return basePriceByCategory[market.category] * multiplier;
}

export function generateMockChange(): number {
  return Number((Math.random() * 7 - 3.5).toFixed(1));
}

export function generateMockMarketAnalysis(
  market: Market
): MarketAnalysisResult {
  const price = generateMockPrice(market);

  return analyzeMarket({
    symbol: market.symbol,
    price,
    change24h: generateMockChange(),
  });
}

export function formatMarketNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}
