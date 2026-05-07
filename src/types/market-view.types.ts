import type { MarketAnalysisResult } from "@/types/market-analysis.types";
import type { MarketData } from "@/types/market-data.types";
import type { Market } from "@/types/market.types";

export interface MarketGridItem {
  market: Market;
  marketData: MarketData;
  analysis: MarketAnalysisResult;
}
