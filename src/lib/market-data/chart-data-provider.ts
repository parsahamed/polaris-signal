import type { CandlePoint, ChartTimeframe } from "@/types/chart.types";

export interface ChartDataProvider {
  getCandles(input: {
    symbol: string;
    timeframe: ChartTimeframe;
  }): Promise<CandlePoint[]>;
}
