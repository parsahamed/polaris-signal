"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";

import { AnalysisOverview } from "@/components/market/AnalysisOverview";
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
  useMarketCandlesInfiniteQuery,
  useMarketDetailQuery,
} from "@/hooks/use-market-queries";
import { useMarketAnalysis } from "@/hooks/use-market-analysis";
import type { MarketTechnicalAnalysis } from "@/types/analysis.types";
import type { ChartTimeframe } from "@/types/chart.types";
import type { RiskLevel, Signal } from "@/types/signal.types";

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

function riskLevelFromVolatility(
  volatility: MarketTechnicalAnalysis["volatility"],
): RiskLevel {
  return volatility;
}

function signalFromAnalysis(analysis: MarketTechnicalAnalysis): Signal {
  const { breakout, currentPrice, marketStructure, movingAverages } = analysis;
  const isInsufficient =
    currentPrice === 0 ||
    marketStructure.structure === "insufficient-data";
  const priceBelowSupport =
    analysis.supportResistance.support !== undefined &&
    currentPrice < analysis.supportResistance.support;

  if (isInsufficient) {
    return {
      status: "neutral",
      confidence: 0,
      riskLevel: "low",
      reasons: analysis.reasons,
    };
  }

  if (
    (breakout.direction === "breakout-down" &&
      analysis.volatility === "high") ||
    (priceBelowSupport &&
      marketStructure.structure === "lower-highs-lower-lows")
  ) {
    return {
      status: "danger",
      confidence: 80,
      riskLevel: "high",
      reasons: analysis.reasons,
    };
  }

  if (
    analysis.trend === "bullish" &&
    marketStructure.structure === "higher-highs-higher-lows" &&
    (breakout.direction === "breakout-up" ||
      (movingAverages.sma25 !== undefined &&
        currentPrice > movingAverages.sma25)) &&
    analysis.volume.confirmation !== "weak"
  ) {
    return {
      status: "bullish",
      confidence:
        analysis.trendStrength.strength === "strong" ? 78 : 68,
      riskLevel: riskLevelFromVolatility(analysis.volatility),
      reasons: analysis.reasons,
    };
  }

  if (
    analysis.trend === "bearish" &&
    marketStructure.structure === "lower-highs-lower-lows" &&
    (breakout.direction === "breakout-down" ||
      (movingAverages.sma25 !== undefined &&
        currentPrice < movingAverages.sma25))
  ) {
    return {
      status: "bearish",
      confidence:
        analysis.trendStrength.strength === "strong" ? 78 : 68,
      riskLevel: riskLevelFromVolatility(analysis.volatility),
      reasons: analysis.reasons,
    };
  }

  return {
    status: "neutral",
    confidence: analysis.trendStrength.strength === "weak" ? 45 : 55,
    riskLevel: riskLevelFromVolatility(analysis.volatility),
    reasons: analysis.reasons,
  };
}

export function MarketDetailClient({ symbol }: MarketDetailClientProps) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>("1D");
  const detailQuery = useMarketDetailQuery(symbol);
  const candlesQuery = useMarketCandlesInfiniteQuery(symbol, timeframe);
  const candles = useMemo(() => {
    const candlesByTime = new Map(
      candlesQuery.data?.pages
        .flat()
        .map((candle) => {
          return [candle.time, candle] as const;
        }) ?? [],
    );

    return Array.from(candlesByTime.values()).sort((first, second) => {
      return Number(first.time) - Number(second.time);
    });
  }, [candlesQuery.data]);
  const technicalAnalysis = useMarketAnalysis(symbol, candles, timeframe);
  const technicalSignal = useMemo(() => {
    return signalFromAnalysis(technicalAnalysis);
  }, [technicalAnalysis]);

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
        signal={technicalSignal.status}
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
            onLoadOlderCandles={() => {
              void candlesQuery.fetchNextPage();
            }}
            hasMoreCandles={candlesQuery.hasNextPage}
            isLoadingOlderCandles={candlesQuery.isFetchingNextPage}
          />
          <WhySignal reasons={technicalAnalysis.reasons} />
        </div>

        <aside className="flex flex-col gap-6">
          <SignalPanel
            signal={technicalSignal.status}
            confidence={technicalSignal.confidence}
            riskLevel={technicalSignal.riskLevel}
            reasons={technicalAnalysis.reasons}
            trend={technicalAnalysis.trend}
            volatility={technicalAnalysis.volatility}
          />
          <AnalysisOverview analysis={technicalAnalysis} />
          <SupportResistance
            support={technicalAnalysis.supportResistance.support}
            resistance={technicalAnalysis.supportResistance.resistance}
          />
        </aside>
      </div>
    </main>
  );
}
