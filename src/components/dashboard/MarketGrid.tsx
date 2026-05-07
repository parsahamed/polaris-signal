import { MarketCard } from "@/components/dashboard/MarketCard";
import type { MarketGridItem } from "@/types/market-view.types";

interface MarketGridProps {
  items: MarketGridItem[];
}

export function MarketGrid({ items }: MarketGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <MarketCard
          key={item.market.symbol}
          market={item.market}
          marketData={item.marketData}
          analysis={item.analysis}
        />
      ))}
    </section>
  );
}
