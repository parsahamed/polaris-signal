export interface CandlePoint {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type ChartTimeframe = "1H" | "4H" | "1D" | "1W";
