"use client";

import {
  CandlestickSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type Logical,
  type LogicalRange,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMarketNumber } from "@/lib/market-data/mock-market-metrics";
import { cn } from "@/lib/utils";
import type {
  CandlePoint,
  CandleSource,
  ChartTimeframe,
} from "@/types/chart.types";
import type { MarketDataSource } from "@/types/market-data.types";

interface PriceChartProps {
  symbol: string;
  pair: string;
  price: number;
  change24h: number;
  data: CandlePoint[];
  timeframe: ChartTimeframe;
  source: MarketDataSource;
  onTimeframeChange: (timeframe: ChartTimeframe) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  onLoadOlderCandles?: () => void;
  hasMoreCandles?: boolean;
  isLoadingOlderCandles?: boolean;
}

const timeframes: ChartTimeframe[] = ["1H", "4H", "1D", "1W"];

const sourceDescriptions: Record<MarketDataSource, string> = {
  coingecko: "real market price action",
  mock: "mock fallback price action",
  wallex: "local exchange price action",
};

const candleSourceLabels: Record<CandleSource, string> = {
  binance: "Binance",
  okx: "OKX",
  coingecko: "CoinGecko",
  mock: "Mock",
};

export function PriceChart({
  symbol,
  pair,
  price,
  change24h,
  data,
  timeframe,
  source,
  onTimeframeChange,
  isLoading = false,
  isFetching = false,
  onLoadOlderCandles,
  hasMoreCandles = false,
  isLoadingOlderCandles = false,
}: PriceChartProps) {
  const isPositiveChange = change24h >= 0;
  const hasChartData = data.length > 0;
  const candleSource = data.find((candle) => candle.source)?.source;
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const shouldFitContentRef = useRef(true);
  const loadMoreGuardRef = useRef(false);
  const dataRef = useRef<CandlePoint[]>([]);
  const hasMoreCandlesRef = useRef(hasMoreCandles);
  const isLoadingOlderCandlesRef = useRef(isLoadingOlderCandles);
  const onLoadOlderCandlesRef = useRef(onLoadOlderCandles);

  useEffect(() => {
    shouldFitContentRef.current = true;
    loadMoreGuardRef.current = false;
    dataRef.current = [];
  }, [symbol, timeframe, hasChartData]);

  useEffect(() => {
    hasMoreCandlesRef.current = hasMoreCandles;
    isLoadingOlderCandlesRef.current = isLoadingOlderCandles;
    onLoadOlderCandlesRef.current = onLoadOlderCandles;
  }, [hasMoreCandles, isLoadingOlderCandles, onLoadOlderCandles]);

  useEffect(() => {
    if (!isLoadingOlderCandles) {
      loadMoreGuardRef.current = false;
    }
  }, [isLoadingOlderCandles]);

  useEffect(() => {
    const container = chartContainerRef.current;

    if (!container || chartRef.current) {
      return;
    }

    const chart = createChart(container, {
      autoSize: true,
      height: 280,
      layout: {
        background: { color: "transparent" },
        textColor: "#93c5fd",
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.12)" },
        horzLines: { color: "rgba(148, 163, 184, 0.12)" },
      },
      rightPriceScale: {
        borderColor: "rgba(148, 163, 184, 0.2)",
      },
      timeScale: {
        borderColor: "rgba(148, 163, 184, 0.2)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    const handleVisibleRangeChange = () => {
      const logicalRange = chart.timeScale().getVisibleLogicalRange();

      if (
        !logicalRange ||
        !hasMoreCandlesRef.current ||
        isLoadingOlderCandlesRef.current
      ) {
        return;
      }

      const barsInfo = candlestickSeries.barsInLogicalRange(logicalRange);

      if (
        barsInfo &&
        barsInfo.barsBefore < 8 &&
        !loadMoreGuardRef.current
      ) {
        loadMoreGuardRef.current = true;
        onLoadOlderCandlesRef.current?.();
      }
    };

    chart
      .timeScale()
      .subscribeVisibleLogicalRangeChange(handleVisibleRangeChange);
    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    return () => {
      chart
        .timeScale()
        .unsubscribeVisibleLogicalRangeChange(handleVisibleRangeChange);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [symbol, timeframe]);

  useEffect(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;

    if (!chart || !series || data.length === 0) {
      dataRef.current = data;
      return;
    }

    const previousData = dataRef.current;
    const previousRange = chart.timeScale().getVisibleLogicalRange();
    const previousFirstTime = previousData[0]?.time;
    const nextData = data.map((candle) => {
      return {
        time: candle.time as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      };
    });

    series.setData(nextData);

    if (shouldFitContentRef.current) {
      chart.timeScale().fitContent();
      shouldFitContentRef.current = false;
    } else if (previousRange && previousFirstTime !== undefined) {
      const oldFirstIndex = data.findIndex((candle) => {
        return candle.time === previousFirstTime;
      });

      if (oldFirstIndex > 0) {
        const nextRange: LogicalRange = {
          from: (previousRange.from + oldFirstIndex) as Logical,
          to: (previousRange.to + oldFirstIndex) as Logical,
        };

        chart.timeScale().setVisibleLogicalRange(nextRange);
      }
    }

    dataRef.current = data;
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle>{pair} Price Chart</CardTitle>
          <CardDescription>
            {symbol} {sourceDescriptions[source]}
            {candleSource ? ` · Candles: ${candleSourceLabels[candleSource]}` : ""}
          </CardDescription>
        </div>

        <div className="flex gap-2">
          {timeframes.map((timeframeOption) => (
            <Button
              key={timeframeOption}
              size="sm"
              variant={timeframeOption === timeframe ? "default" : "outline"}
              onClick={() => {
                onTimeframeChange(timeframeOption);
              }}
            >
              {timeframeOption}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current price</p>
            <p className="mt-1 text-3xl font-semibold">
              {formatMarketNumber(price)}
            </p>
          </div>

          <Badge
            className={cn(
              isPositiveChange
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300",
            )}
            variant="outline"
          >
            {isPositiveChange ? "+" : ""}
            {change24h}%
          </Badge>
        </div>

        {isFetching ? (
          <p className="text-xs text-muted-foreground">Updating chart...</p>
        ) : null}
        {isLoadingOlderCandles ? (
          <p className="text-xs text-muted-foreground">
            Loading older candles...
          </p>
        ) : null}

        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center rounded-lg border bg-background/40 text-sm text-muted-foreground">
            Loading chart data...
          </div>
        ) : data.length > 0 ? (
          <div className="h-[280px] rounded-lg border bg-background/40 p-2">
            <div ref={chartContainerRef} className="h-full w-full" />
          </div>
        ) : (
          <div className="flex h-[280px] items-center justify-center rounded-lg border bg-background/40 text-sm text-muted-foreground">
            No chart data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
