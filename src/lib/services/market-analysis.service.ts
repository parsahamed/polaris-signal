import { calculateSignal } from "@/lib/signal/signal-engine";
import { calculatePriceZones } from "@/lib/zones/price-zones";
import type { MarketAnalysisResult } from "@/types/market-analysis.types";

interface AnalyzeMarketInput {
  symbol: string;
  price: number;
  change24h: number;
  volume?: number;
}

export function analyzeMarket(input: AnalyzeMarketInput): MarketAnalysisResult {
  const zones = calculatePriceZones(input.price);
  const signal = calculateSignal({
    ...input,
    zones,
  });

  return {
    symbol: input.symbol,
    price: input.price,
    change24h: input.change24h,
    zones,
    signal,
  };
}
