import { getMarketDataProvider } from "@/lib/market-data/market-data-provider.factory";
import type { MarketData } from "@/types/market-data.types";

export async function getMarketData(
  symbol: string
): Promise<MarketData | undefined> {
  const provider = getMarketDataProvider();

  return provider.getMarketData(symbol);
}

export async function getMarketDataList(
  symbols: string[]
): Promise<MarketData[]> {
  const provider = getMarketDataProvider();

  return provider.getMarketDataList(symbols);
}
