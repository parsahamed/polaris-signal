import { getChartDataProvider } from "@/lib/market-data/chart-data-provider.factory";
import type { CandlePoint, ChartTimeframe } from "@/types/chart.types";

export async function getCandles(input: {
  symbol: string;
  timeframe: ChartTimeframe;
}): Promise<CandlePoint[]> {
  const provider = getChartDataProvider();

  return provider.getCandles(input);
}
// TODO: Add server-side cache for historical candles.
// TODO: Add provider fallback chain: CoinGecko -> Wallex -> Mock.
// TODO: Move large persisted candle data to IndexedDB if localStorage becomes too small.