import { NextResponse } from "next/server";

import { getActiveMarkets } from "@/lib/market-data/market-config.service";
import { getMarketDataList } from "@/lib/market-data/market-data.service";
import { analyzeMarket } from "@/lib/services/market-analysis.service";

export async function GET() {
  const markets = getActiveMarkets();
  const marketDataList = await getMarketDataList(
    markets.map((market) => market.symbol),
  );

  const marketDataBySymbol = new Map(
    marketDataList.map((marketData) => [marketData.symbol, marketData]),
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

  return NextResponse.json(items);
}