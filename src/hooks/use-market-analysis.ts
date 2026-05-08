"use client";

import { useMemo } from "react";

import { analyzeCandles } from "@/lib/analysis/market-analysis.engine";
import type { CandlePoint, ChartTimeframe } from "@/types/chart.types";

export function useMarketAnalysis(
  symbol: string,
  candles: CandlePoint[],
  timeframe: ChartTimeframe,
) {
  return useMemo(() => {
    return analyzeCandles({ symbol, candles, timeframe });
  }, [symbol, candles, timeframe]);
}
