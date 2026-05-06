import { MarketCard } from "@/components/dashboard/MarketCard";
import type { Market } from "@/types/market.types";

interface MarketGridProps {
  markets: Market[];
}

export function MarketGrid({ markets }: MarketGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {markets.map((market) => (
        <MarketCard key={market.symbol} market={market} />
      ))}
    </section>
  );
}
