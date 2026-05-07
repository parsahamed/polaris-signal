import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMarketNumber } from "@/lib/market-data/mock-market-metrics";
import { cn } from "@/lib/utils";

interface PriceChartPlaceholderProps {
  symbol: string;
  pair: string;
  price: number;
  change24h: number;
}

export function PriceChartPlaceholder({
  symbol,
  pair,
  price,
  change24h,
}: PriceChartPlaceholderProps) {
  const isPositiveChange = change24h >= 0;

  return (
    <Card className="border-border/70">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{pair} Price Chart</CardTitle>
            <CardDescription>{symbol} market structure preview</CardDescription>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current price</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {formatMarketNumber(price)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Chart integration coming soon
          </p>
        </div>

        <div className="relative h-72 overflow-hidden rounded-lg border border-border bg-muted/20">
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_48px]" />
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 800 288"
          >
            <defs>
              <linearGradient id="chart-line" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--success)" />
              </linearGradient>
              <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity="0.18"
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="M0 216 C96 184 128 204 208 168 C288 132 320 148 392 124 C488 92 552 116 624 80 C704 40 752 68 800 44 L800 288 L0 288 Z"
              fill="url(#chart-fill)"
            />
            <path
              d="M0 216 C96 184 128 204 208 168 C288 132 320 148 392 124 C488 92 552 116 624 80 C704 40 752 68 800 44"
              fill="none"
              stroke="url(#chart-line)"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
          <div className="absolute bottom-4 left-4 rounded-md border border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
            Placeholder data only
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
