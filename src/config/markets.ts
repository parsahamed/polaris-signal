import type { Market } from "@/types/market.types";

export const defaultMarkets: Market[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    pair: "BTC/USDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    category: "crypto",
    isActive: true,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    pair: "ETH/USDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    category: "crypto",
    isActive: true,
  },
  {
    symbol: "USOON",
    name: "Gold Ounce",
    pair: "USOON/USDT",
    baseAsset: "USOON",
    quoteAsset: "USDT",
    category: "gold",
    isActive: true,
  },
  {
    symbol: "XAUT",
    name: "Tether Gold",
    pair: "XAUT/USDT",
    baseAsset: "XAUT",
    quoteAsset: "USDT",
    category: "gold",
    isActive: true,
  },
];
