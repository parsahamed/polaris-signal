import { MarketDetailClient } from "@/components/market/MarketDetailClient";

interface MarketPageProps {
  params: Promise<{
    symbol: string;
  }>;
}

export default async function MarketPage({ params }: MarketPageProps) {
  const { symbol } = await params;

  return <MarketDetailClient symbol={symbol} />;
}
