export type MarketCategory = "crypto" | "gold" | "forex" | "iran-market";

export interface Market {
  symbol: string;
  name: string;
  pair: string;
  baseAsset: string;
  quoteAsset: string;
  category: MarketCategory;
  isActive: boolean;
}
