import { mockMarketData } from "@/lib/market-data/mock-market-data";
import type { MarketData } from "@/types/market-data.types";

export function getMarketData(symbol: string): MarketData | undefined {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return mockMarketData.find((marketData) => {
    return marketData.symbol === normalizedSymbol;
  });
}

export function getMarketDataList(symbols: string[]): MarketData[] {
  return symbols
    .map((symbol) => {
      return getMarketData(symbol);
    })
    .filter((marketData): marketData is MarketData => {
      return Boolean(marketData);
    });
}
