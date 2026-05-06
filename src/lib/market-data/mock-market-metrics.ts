import type { Market } from "@/types/market.types";

export type MockSignalStatus = "bullish" | "neutral" | "bearish" | "danger";

export interface MockMarketMetrics {
  price: number;
  change24h: number;
  signal: MockSignalStatus;
  support: number;
  resistance: number;
  reasons: string[];
}

const basePriceByCategory: Record<Market["category"], number> = {
  crypto: 42000,
  gold: 2400,
  forex: 1,
  "iran-market": 59000,
};

export const signalLabels: Record<MockSignalStatus, string> = {
  bullish: "Bullish",
  neutral: "Neutral",
  bearish: "Bearish",
  danger: "Danger",
};

export function generateMockPrice(market: Market): number {
  const multiplier = 0.85 + Math.random() * 0.3;

  return basePriceByCategory[market.category] * multiplier;
}

export function generateMockChange(): number {
  return Number((Math.random() * 7 - 3.5).toFixed(1));
}

export function generateMockSignal(): MockSignalStatus {
  const signals: MockSignalStatus[] = ["bullish", "neutral", "bearish", "danger"];

  return signals[Math.floor(Math.random() * signals.length)];
}

export function generateMockMarketMetrics(market: Market): MockMarketMetrics {
  const price = generateMockPrice(market);

  return {
    price,
    change24h: generateMockChange(),
    signal: generateMockSignal(),
    support: price * 0.97,
    resistance: price * 1.03,
    reasons: [
      "Price is currently above support zone",
      "Price is below resistance zone",
      "Market momentum is neutral",
      "Volume confirmation is not available yet",
    ],
  };
}

export function formatMarketNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}
