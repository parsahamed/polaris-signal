import { useQuery } from "@tanstack/react-query";

import {
  fetchMarketCandles,
  fetchMarketDetail,
  fetchMarkets,
} from "@/lib/api/market-api.client";
import type { ChartTimeframe } from "@/types/chart.types";

export function useMarketsQuery() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarkets,
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnReconnect: true,
  });
}

export function useMarketDetailQuery(symbol: string) {
  return useQuery({
    queryKey: ["market", symbol],
    queryFn: () => fetchMarketDetail(symbol),
    staleTime: 60_000,
    enabled: Boolean(symbol),
  });
}

export function useMarketCandlesQuery(
  symbol: string,
  timeframe: ChartTimeframe,
) {
  return useQuery({
    queryKey: ["candles", symbol, timeframe],
    queryFn: () => fetchMarketCandles(symbol, timeframe),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(symbol),
  });
}
