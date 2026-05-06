import { defaultMarkets } from "@/config/markets";
import type { Market } from "@/types/market.types";

export function getAllMarkets(): Market[] {
  return [...defaultMarkets];
}

export function getActiveMarkets(): Market[] {
  return defaultMarkets.filter((market) => market.isActive);
}

export function getMarketBySymbol(symbol: string): Market | undefined {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return defaultMarkets.find((market) => market.symbol === normalizedSymbol);
}
