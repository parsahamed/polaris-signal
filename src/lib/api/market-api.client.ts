import type { CandlePoint, ChartTimeframe } from "@/types/chart.types";
import type { MarketGridItem } from "@/types/market-view.types";

export async function fetchMarkets(): Promise<MarketGridItem[]> {
  const response = await fetch("/api/markets");

  if (!response.ok) {
    throw new Error("Failed to fetch markets");
  }

  return response.json() as Promise<MarketGridItem[]>;
}

export async function fetchMarketDetail(symbol: string) {
  const response = await fetch(`/api/markets/${symbol}`);

  if (!response.ok) {
    throw new Error("Failed to fetch market detail");
  }

  return response.json();
}

export async function fetchMarketCandles(
  symbol: string,
  timeframe: ChartTimeframe,
): Promise<CandlePoint[]> {
  const response = await fetch(
    `/api/markets/${symbol}/candles?timeframe=${timeframe}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch candles");
  }

  return response.json();
}
