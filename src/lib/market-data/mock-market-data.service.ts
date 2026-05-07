import { MockMarketDataProvider } from "@/lib/market-data/mock-market-data.provider";

export const getMockMarketData = async () => {
  const provider = new MockMarketDataProvider();

  return provider.getMarketDataList(["BTC", "ETH", "USOON", "XAUT"]);
};
