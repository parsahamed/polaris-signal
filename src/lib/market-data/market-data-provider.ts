import type { MarketData } from "@/types/market-data.types";

export interface MarketDataProvider {
  getMarketData(symbol: string): Promise<MarketData | undefined>;
  getMarketDataList(symbols: string[]): Promise<MarketData[]>;
}
