import type { ChartDataProvider } from "@/lib/market-data/chart-data-provider";
import { CoinGeckoChartDataProvider } from "@/lib/market-data/coingecko-chart-data.provider";
import { MockChartDataProvider } from "@/lib/market-data/mock-chart-data.provider";

export function getChartDataProvider(): ChartDataProvider {
  return new CoinGeckoChartDataProvider(new MockChartDataProvider());
}
