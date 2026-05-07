"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

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
}

const timeframes: ChartTimeframe[] = ["1H", "4H", "1D", "1W"];

const sourceDescriptions: Record<MarketDataSource, string> = {
  coingecko: "real market price action",
  mock: "mock fallback price action",
  wallex: "local exchange price action",
};

function ChartTooltip({
  active,
  payload,
  label,
}: TooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const rawPrice = payload[0]?.value;
  const price = Number(Array.isArray(rawPrice) ? rawPrice[0] : rawPrice);

  return (
    <div className="rounded-lg border border-border bg-background/95 px-3 py-2 text-sm shadow-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium tabular-nums text-foreground">
        {formatMarketNumber(price)}
      </p>
    </div>
  );
}

export function PriceChart({
  symbol,
  pair,
  price,
  change24h,
  data,
  timeframe,
  source,
}: PriceChartProps) {
  const isPositiveChange = change24h >= 0;

  return (
    <Card className="border-border/70">
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>{pair} Price Chart</CardTitle>
            <CardDescription>
              {symbol} {sourceDescriptions[source]}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {timeframes.map((timeframeOption) => (
              <Button
                key={timeframeOption}
                variant={timeframeOption === timeframe ? "secondary" : "outline"}
                size="xs"
              >
                {timeframeOption}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current price</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {formatMarketNumber(price)}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "w-fit tabular-nums",
              isPositiveChange
                ? "border-success/30 bg-success/15 text-success"
                : "border-red-500/30 bg-red-500/15 text-red-300"
            )}
          >
            {isPositiveChange ? "+" : ""}
            {change24h}%
          </Badge>
        </div>

        <div className="h-72 rounded-lg border border-border bg-muted/20 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 8, right: 8, top: 12 }}>
              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                minTickGap={28}
                stroke="var(--muted-foreground)"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={64}
                domain={["dataMin", "dataMax"]}
                stroke="var(--muted-foreground)"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) => {
                  return formatMarketNumber(Number(value));
                }}
              />
              <Tooltip
                content={(props) => {
                  return <ChartTooltip {...props} />;
                }}
                cursor={{ stroke: "var(--primary)", strokeOpacity: 0.35 }}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
