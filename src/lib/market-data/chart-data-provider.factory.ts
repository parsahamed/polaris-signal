import type { ChartDataProvider } from "@/lib/market-data/chart-data-provider";
import { BinanceChartDataProvider } from "@/lib/market-data/binance-chart-data.provider";
import { CoinGeckoChartDataProvider } from "@/lib/market-data/coingecko-chart-data.provider";
import { FallbackChartDataProvider } from "@/lib/market-data/fallback-chart-data.provider";
import { OkxChartDataProvider } from "@/lib/market-data/okx-chart-data.provider";

export function getChartDataProvider(): ChartDataProvider {
  return new FallbackChartDataProvider([
    new BinanceChartDataProvider(),
    new OkxChartDataProvider(),
    new CoinGeckoChartDataProvider(),
  ]);
}
