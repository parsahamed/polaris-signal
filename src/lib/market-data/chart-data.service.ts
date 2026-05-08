import { getChartDataProvider } from "@/lib/market-data/chart-data-provider.factory";
import type { CandlePoint, CandleRequestInput } from "@/types/chart.types";

export async function getCandles(
  input: CandleRequestInput,
): Promise<CandlePoint[]> {
  const provider = getChartDataProvider();

  return provider.getCandles(input);
}
// TODO: Add server-side cache for historical candles.
// TODO: Add provider fallback chain: CoinGecko -> Wallex -> Mock.
