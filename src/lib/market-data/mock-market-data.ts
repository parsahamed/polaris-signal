import type { MarketData } from "@/types/market-data.types";

export const mockMarketData: MarketData[] = [
  {
    symbol: "BTC",
    price: 67250,
    change24h: 2.4,
    volume24h: 28600000000,
    updatedAt: "2026-05-07T09:00:00.000Z",
  },
  {
    symbol: "ETH",
    price: 3485,
    change24h: 1.1,
    volume24h: 13400000000,
    updatedAt: "2026-05-07T09:00:00.000Z",
  },
  {
    symbol: "USOON",
    price: 2338,
    change24h: -0.6,
    volume24h: 870000000,
    updatedAt: "2026-05-07T09:00:00.000Z",
  },
  {
    symbol: "XAUT",
    price: 2326,
    change24h: -0.3,
    volume24h: 42000000,
    updatedAt: "2026-05-07T09:00:00.000Z",
  },
  {
    symbol: "USDT_TMN",
    price: 59250,
    change24h: 0.8,
    volume24h: 2180000000000,
    updatedAt: "2026-05-07T09:00:00.000Z",
  },
];
