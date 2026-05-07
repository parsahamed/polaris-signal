import { MarketCard } from "@/components/dashboard/MarketCard";
import type { MarketAnalysisResult } from "@/types/market-analysis.types";
import type { Market } from "@/types/market.types";

export interface MarketGridItem {
  market: Market;
  analysis: MarketAnalysisResult;
}

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
          analysis={item.analysis}
        />
      ))}
    </section>
  );
}
