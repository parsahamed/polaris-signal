export type MarketDataSource = "coingecko" | "mock" | "wallex";

export type MarketQuoteCurrency = "USD" | "USDT" | "TMN";

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h?: number;
  updatedAt: string;
  source: MarketDataSource;
  quoteCurrency?: MarketQuoteCurrency;
}
