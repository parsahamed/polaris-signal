import type { CandlePoint, CandleRequestInput } from "@/types/chart.types";

export interface ChartDataProvider {
  getCandles(input: CandleRequestInput): Promise<CandlePoint[]>;
}
