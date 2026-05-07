import { NextResponse } from "next/server";

import { getMarketBySymbol } from "@/lib/market-data/market-config.service";
import { getMarketData } from "@/lib/market-data/market-data.service";
import { analyzeMarket } from "@/lib/services/market-analysis.service";

interface RouteParams {
  params: Promise<{
    symbol: string;
  }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  const { symbol } = await params;
  const market = getMarketBySymbol(symbol);

  if (!market) {
    return NextResponse.json(
      { message: "Market not found" },
      { status: 404 },
    );
  }

  const marketData = await getMarketData(market.symbol);

  if (!marketData) {
    return NextResponse.json(
      { message: "Market data not found" },
      { status: 404 },
    );
  }

  const analysis = analyzeMarket({
    symbol: marketData.symbol,
    price: marketData.price,
    change24h: marketData.change24h,
    volume: marketData.volume24h,
  });

  return NextResponse.json({
    market,
    marketData,
    analysis,
  });
}
