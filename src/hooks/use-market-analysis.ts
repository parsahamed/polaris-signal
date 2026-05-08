"use client";

import { useMemo } from "react";

import { analyzeCandles } from "@/lib/analysis/market-analysis.engine";
import type { CandlePoint } from "@/types/chart.types";

export function useMarketAnalysis(symbol: string, candles: CandlePoint[]) {
  return useMemo(() => {
    return analyzeCandles({ symbol, candles });
  }, [symbol, candles]);
}
