import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Market } from "@/types/market.types";

type SignalStatus = "bullish" | "neutral" | "bearish" | "danger";

interface MarketCardProps {
  market: Market;
}

const signalLabels: Record<SignalStatus, string> = {
  bullish: "Bullish",
  neutral: "Neutral",
  bearish: "Bearish",
  danger: "Danger",
};

const signalClasses: Record<SignalStatus, string> = {
  bullish: "border-success/30 bg-success/15 text-success",
  neutral: "border-border bg-secondary text-secondary-foreground",
  bearish: "border-red-500/30 bg-red-500/15 text-red-300",
  danger: "",
};

function generateMockPrice(market: Market): number {
  const basePriceByCategory: Record<Market["category"], number> = {
    crypto: 42000,
    gold: 2400,
    forex: 1,
    "iran-market": 59000,
  };

  const multiplier = 0.85 + Math.random() * 0.3;

  return basePriceByCategory[market.category] * multiplier;
}

function generateMockChange(): number {
  return Number((Math.random() * 7 - 3.5).toFixed(1));
}

function generateMockSignal(): SignalStatus {
  const signals: SignalStatus[] = ["bullish", "neutral", "bearish", "danger"];

  return signals[Math.floor(Math.random() * signals.length)];
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

export function MarketCard({ market }: MarketCardProps) {
  const price = generateMockPrice(market);
  const change = generateMockChange();
  const signal = generateMockSignal();
  const support = price * 0.97;
  const resistance = price * 1.03;
  const isPositiveChange = change >= 0;

  return (
    <Card className="cursor-pointer border-border/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="truncate">{market.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{market.pair}</p>
          </div>
          <Badge
            variant={signal === "danger" ? "destructive" : "outline"}
            className={cn(signalClasses[signal])}
          >
            {signalLabels[signal]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Price</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {formatNumber(price)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">24h</p>
            <p
              className={cn(
                "mt-1 font-medium tabular-nums",
                isPositiveChange ? "text-success" : "text-red-300"
              )}
            >
              {isPositiveChange ? "+" : ""}
              {change}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Support</p>
            <p className="mt-1 font-medium tabular-nums">
              {formatNumber(support)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Resistance</p>
            <p className="mt-1 font-medium tabular-nums">
              {formatNumber(resistance)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Asset</p>
            <p className="mt-1 font-medium">{market.baseAsset}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
