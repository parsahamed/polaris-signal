import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MarketHeader } from "@/components/market/MarketHeader";
import { PriceChartPlaceholder } from "@/components/market/PriceChartPlaceholder";
import { SignalPanel } from "@/components/market/SignalPanel";
import { SupportResistance } from "@/components/market/SupportResistance";
import { WhySignal } from "@/components/market/WhySignal";
import { buttonVariants } from "@/components/ui/button";
import { generateMockMarketMetrics } from "@/lib/market-data/mock-market-metrics";
import { getMarketBySymbol } from "@/lib/market-data/market-config.service";

interface MarketPageProps {
  params: Promise<{
    symbol: string;
  }>;
}

export default async function MarketPage({ params }: MarketPageProps) {
  const { symbol } = await params;
  const market = getMarketBySymbol(symbol);

  if (!market) {
    notFound();
  }

  const metrics = generateMockMarketMetrics(market);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        <ArrowLeft />
        Dashboard
      </Link>

      <MarketHeader
        market={market}
        price={metrics.price}
        change24h={metrics.change24h}
        signal={metrics.signal}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-6">
          <PriceChartPlaceholder />
          <WhySignal reasons={metrics.reasons} />
        </div>

        <aside className="flex flex-col gap-6">
          <SignalPanel signal={metrics.signal} reasons={metrics.reasons} />
          <SupportResistance
            support={metrics.support}
            resistance={metrics.resistance}
          />
        </aside>
      </div>
    </main>
  );
}
