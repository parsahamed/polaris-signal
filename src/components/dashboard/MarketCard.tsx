import Link from "next/link";

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
import type { MarketAnalysisResult } from "@/types/market-analysis.types";
import type { Market } from "@/types/market.types";
import type { SignalStatus } from "@/types/signal.types";

interface MarketCardProps {
  market: Market;
  analysis: MarketAnalysisResult;
}

const signalClasses: Record<SignalStatus, string> = {
  bullish: "border-success/30 bg-success/15 text-success",
  neutral: "border-border bg-secondary text-secondary-foreground",
  bearish: "border-red-500/30 bg-red-500/15 text-red-300",
  danger: "",
};

export function MarketCard({ market, analysis }: MarketCardProps) {
  const isPositiveChange = analysis.change24h >= 0;
  const signalStatus = analysis.signal.status;

  return (
    <Link
      href={`/markets/${market.symbol}`}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full cursor-pointer border-border/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="truncate">{market.name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {market.pair}
              </p>
            </div>
            <Badge
              variant={signalStatus === "danger" ? "destructive" : "outline"}
              className={cn(signalClasses[signalStatus])}
            >
              {signalLabels[signalStatus]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Price</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatMarketNumber(analysis.price)}
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
                {analysis.change24h}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Support</p>
              <p className="mt-1 font-medium tabular-nums">
                {formatMarketNumber(analysis.zones.support)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Resistance</p>
              <p className="mt-1 font-medium tabular-nums">
                {formatMarketNumber(analysis.zones.resistance)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Asset</p>
              <p className="mt-1 font-medium">{market.baseAsset}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
