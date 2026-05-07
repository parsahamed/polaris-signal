"use client";

import {
  CandlestickSeries,
  createChart,
  type IChartApi,
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
import type { CandlePoint, ChartTimeframe } from "@/types/chart.types";
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
}

const timeframes: ChartTimeframe[] = ["1H", "4H", "1D", "1W"];

const sourceDescriptions: Record<MarketDataSource, string> = {
  coingecko: "real market price action",
  mock: "mock fallback price action",
  wallex: "local exchange price action",
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
}: PriceChartProps) {
  const isPositiveChange = change24h >= 0;
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const container = chartContainerRef.current;

    if (!container || data.length === 0) {
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

    candlestickSeries.setData(
      data.map((candle) => {
        return {
          time: candle.time as UTCTimestamp,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        };
      }),
    );

    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle>{pair} Price Chart</CardTitle>
          <CardDescription>
            {symbol} {sourceDescriptions[source]}
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
