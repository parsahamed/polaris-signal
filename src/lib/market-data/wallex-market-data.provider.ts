import type { MarketDataProvider } from "@/lib/market-data/market-data-provider";
import type { MarketData } from "@/types/market-data.types";

export class WallexMarketDataProvider implements MarketDataProvider {
  async getMarketData(_symbol: string): Promise<MarketData | undefined> {
    void _symbol;
    // TODO: Add Wallex/local exchange market lookup when provider requirements are defined.
    return undefined;
  }

  async getMarketDataList(_symbols: string[]): Promise<MarketData[]> {
    void _symbols;
    // TODO: Add batched Wallex/local exchange data once real API integration is approved.
    return [];
  }
}
