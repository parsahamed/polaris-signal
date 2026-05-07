import { MockChartDataProvider } from "@/lib/market-data/mock-chart-data.provider";
import type { CandlePoint, ChartTimeframe } from "@/types/chart.types";

export async function getMockChartData(
  symbol: string,
  timeframe: ChartTimeframe = "1D"
): Promise<CandlePoint[]> {
  const provider = new MockChartDataProvider();

  return provider.getCandles({ symbol, timeframe });
}
