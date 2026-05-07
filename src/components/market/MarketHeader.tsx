import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatMarketNumber,
  signalLabels,
} from "@/lib/market-data/mock-market-metrics";
import { cn } from "@/lib/utils";
import type { Market } from "@/types/market.types";
import type { SignalStatus } from "@/types/signal.types";

interface MarketHeaderProps {
  market: Market;
  price: number;
  change24h: number;
  signal: SignalStatus;
}

const signalClasses: Record<SignalStatus, string> = {
  bullish: "border-success/30 bg-success/15 text-success",
  neutral: "border-border bg-secondary text-secondary-foreground",
  bearish: "border-red-500/30 bg-red-500/15 text-red-300",
  danger: "",
};

export function MarketHeader({
  market,
  price,
  change24h,
  signal,
}: MarketHeaderProps) {
  const isPositiveChange = change24h >= 0;

  return (
    <Card className="border-border/70">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-3xl">{market.name}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{market.pair}</p>
          </div>
          <Badge
            variant={signal === "danger" ? "destructive" : "outline"}
            className={cn(signalClasses[signal])}
          >
            {signalLabels[signal]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {formatMarketNumber(price)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">24h Change</p>
          <p
            className={cn(
              "mt-1 text-2xl font-semibold tabular-nums",
              isPositiveChange ? "text-success" : "text-red-300"
            )}
          >
            {isPositiveChange ? "+" : ""}
            {change24h}%
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Category</p>
          <p className="mt-1 text-2xl font-semibold capitalize">
            {market.category}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
