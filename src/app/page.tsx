import { MarketGrid } from "@/components/dashboard/MarketGrid";
import { getActiveMarkets } from "@/lib/market-data/market-config.service";

export default function Home() {
  const markets = getActiveMarkets();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Polaris Signal
        </h1>
        <p className="text-sm text-muted-foreground">Market overview</p>
      </header>

      <MarketGrid markets={markets} />
    </main>
  );
}
