"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { MarketHeader } from "@/components/market/MarketHeader";
import { PriceChart } from "@/components/market/PriceChart";
import { SignalPanel } from "@/components/market/SignalPanel";
import { SupportResistance } from "@/components/market/SupportResistance";
import { WhySignal } from "@/components/market/WhySignal";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarketCandlesQuery,
  useMarketDetailQuery,
} from "@/hooks/use-market-queries";
import type { ChartTimeframe } from "@/types/chart.types";

interface MarketDetailClientProps {
  symbol: string;
}

function DetailLoadingState() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        <ArrowLeft />
        Dashboard
      </Link>
      <Card className="border-border/70">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </CardContent>
      </Card>
    </main>
  );
}

export function MarketDetailClient({ symbol }: MarketDetailClientProps) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>("1D");
  const detailQuery = useMarketDetailQuery(symbol);
  const candlesQuery = useMarketCandlesQuery(symbol, timeframe);

  if (detailQuery.isLoading) {
    return <DetailLoadingState />;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeft />
          Dashboard
        </Link>
        <Card className="max-w-2xl border-border/70">
          <CardHeader>
            <CardTitle>Market unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {detailQuery.error instanceof Error
              ? detailQuery.error.message
              : "Market data is not available for this market yet."}
          </CardContent>
        </Card>
      </main>
    );
  }

  const { analysis, market, marketData } = detailQuery.data;
  const candles = candlesQuery.data ?? [];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        <ArrowLeft />
        Dashboard
      </Link>

      <MarketHeader
        market={market}
        price={analysis.price}
        change24h={analysis.change24h}
        signal={analysis.signal.status}
        source={marketData.source}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-6">
          <PriceChart
            symbol={market.symbol}
            pair={market.pair}
            price={analysis.price}
            change24h={analysis.change24h}
            data={candles}
            timeframe={timeframe}
            source={marketData.source}
            onTimeframeChange={setTimeframe}
            isLoading={candlesQuery.isLoading}
            isFetching={candlesQuery.isFetching}
          />
          <WhySignal reasons={analysis.signal.reasons} />
        </div>

        <aside className="flex flex-col gap-6">
          <SignalPanel
            signal={analysis.signal.status}
            confidence={analysis.signal.confidence}
            riskLevel={analysis.signal.riskLevel}
            reasons={analysis.signal.reasons}
          />
          <SupportResistance
            support={analysis.zones.support}
            resistance={analysis.zones.resistance}
          />
        </aside>
      </div>
    </main>
  );
}
