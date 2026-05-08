import { NextResponse } from "next/server";

import { getCandles } from "@/lib/market-data/chart-data.service";
import type { ChartTimeframe } from "@/types/chart.types";

interface RouteParams {
  params: Promise<{
    symbol: string;
  }>;
}

const allowedTimeframes: ChartTimeframe[] = ["1H", "4H", "1D", "1W"];

export async function GET(request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(request.url);
  const { symbol } = await params;
  const timeframe = searchParams.get("timeframe") ?? "1D";
  const beforeParam = searchParams.get("before");
  const before = beforeParam ? Number(beforeParam) : undefined;

  if (!allowedTimeframes.includes(timeframe as ChartTimeframe)) {
    return NextResponse.json(
      { message: "Invalid timeframe" },
      { status: 400 },
    );
  }

  if (beforeParam && (!Number.isFinite(before) || Number(before) <= 0)) {
    return NextResponse.json(
      { message: "Invalid before timestamp" },
      { status: 400 },
    );
  }

  const candles = await getCandles({
    symbol,
    timeframe: timeframe as ChartTimeframe,
    before,
  });

  return NextResponse.json(candles);
}
