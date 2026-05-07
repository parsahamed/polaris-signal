import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MarketHeader } from "@/components/market/MarketHeader";
import { PriceChartPlaceholder } from "@/components/market/PriceChartPlaceholder";
import { SignalPanel } from "@/components/market/SignalPanel";
import { SupportResistance } from "@/components/market/SupportResistance";
import { WhySignal } from "@/components/market/WhySignal";
import { buttonVariants } from "@/components/ui/button";
import { getMarketBySymbol } from "@/lib/market-data/market-config.service";
import { generateMockMarketAnalysis } from "@/lib/market-data/mock-market-metrics";

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

  const analysis = generateMockMarketAnalysis(market);

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
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-6">
          <PriceChartPlaceholder />
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
