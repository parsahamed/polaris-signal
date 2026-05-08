import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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
    refetchOnWindowFocus: false,
    enabled: Boolean(symbol),
  });
}

export function useMarketCandlesInfiniteQuery(
  symbol: string,
  timeframe: ChartTimeframe,
) {
  return useInfiniteQuery({
    queryKey: ["candles-infinite", symbol, timeframe],
    queryFn: ({ pageParam }) => {
      return fetchMarketCandles(symbol, timeframe, pageParam);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) {
        return undefined;
      }

      return Math.min(
        ...lastPage.map((candle) => {
          return Number(candle.time);
        }),
      );
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    enabled: Boolean(symbol),
  });
}
