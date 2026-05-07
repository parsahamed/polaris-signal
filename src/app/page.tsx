import { MarketGrid } from "@/components/dashboard/MarketGrid";
import { getActiveMarkets } from "@/lib/market-data/market-config.service";
import { getMarketDataList } from "@/lib/market-data/market-data.service";
import { analyzeMarket } from "@/lib/services/market-analysis.service";

export default async function Home() {
  const markets = getActiveMarkets();
  const marketDataList = await getMarketDataList(
    markets.map((market) => {
      return market.symbol;
    })
  );
  const marketDataBySymbol = new Map(
    marketDataList.map((marketData) => {
      return [marketData.symbol, marketData];
    })
  );
  const items = markets.flatMap((market) => {
    const marketData = marketDataBySymbol.get(market.symbol);

    if (!marketData) {
      return [];
    }

    return [
      {
        market,
        marketData,
        analysis: analyzeMarket({
          symbol: marketData.symbol,
          price: marketData.price,
          change24h: marketData.change24h,
          volume: marketData.volume24h,
        }),
      },
    ];
  });

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
