import { MarketGrid } from "@/components/dashboard/MarketGrid";
import { getActiveMarkets } from "@/lib/market-data/market-config.service";
import { generateMockMarketAnalysis } from "@/lib/market-data/mock-market-metrics";

export default function Home() {
  const markets = getActiveMarkets();
  const items = markets.map((market) => ({
    market,
    analysis: generateMockMarketAnalysis(market),
  }));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Polaris Signal
        </h1>
        <p className="text-sm text-muted-foreground">Market overview</p>
      </header>

      <MarketGrid items={items} />
    </main>
  );
}
