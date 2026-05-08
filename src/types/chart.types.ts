export type CandleSource = "binance" | "okx" | "coingecko" | "mock";

export interface CandlePoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  source?: CandleSource;
}

export type ChartTimeframe = "1H" | "4H" | "1D" | "1W";

export interface CandleRequestInput {
  symbol: string;
  timeframe: ChartTimeframe;
  before?: number;
}
