import { CoinGeckoMarketDataProvider } from "@/lib/market-data/coingecko-market-data.provider";
import type { MarketDataProvider } from "@/lib/market-data/market-data-provider";
import { MockMarketDataProvider } from "@/lib/market-data/mock-market-data.provider";

export function getMarketDataProvider(): MarketDataProvider {
  // USOON remains mock-only until a Wallex/custom provider is added.
  return new CoinGeckoMarketDataProvider(new MockMarketDataProvider());
}
