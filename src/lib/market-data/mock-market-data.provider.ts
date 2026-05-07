import { mockMarketData } from "@/lib/market-data/mock-market-data";
import type { MarketDataProvider } from "@/lib/market-data/market-data-provider";
import type { MarketData } from "@/types/market-data.types";

export class MockMarketDataProvider implements MarketDataProvider {
  async getMarketData(symbol: string): Promise<MarketData | undefined> {
    const normalizedSymbol = symbol.trim().toUpperCase();

    return mockMarketData.find((marketData) => {
      return marketData.symbol === normalizedSymbol;
    });
  }

  async getMarketDataList(symbols: string[]): Promise<MarketData[]> {
    const marketDataList = await Promise.all(
      symbols.map((symbol) => {
        return this.getMarketData(symbol);
      })
    );

    return marketDataList.filter((marketData): marketData is MarketData => {
      return Boolean(marketData);
    });
  }
}
