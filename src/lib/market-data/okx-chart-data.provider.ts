import type { ChartDataProvider } from "@/lib/market-data/chart-data-provider";
import { getExchangeSymbols } from "@/lib/market-data/exchange-symbols";
import type {
  CandlePoint,
  CandleRequestInput,
  ChartTimeframe,
} from "@/types/chart.types";

const OKX_CANDLES_URL = "https://www.okx.com/api/v5/market/candles";
const OKX_LIMIT = "200";

const OKX_BAR_BY_TIMEFRAME: Record<ChartTimeframe, string> = {
  "1H": "1H",
  "4H": "4H",
  "1D": "1D",
  "1W": "1W",
};

interface OkxCandlesResponse {
  code: string;
  msg?: string;
  data?: string[][];
}

function parseNumber(value: string): number {
  return Number(value);
}

export class OkxChartDataProvider implements ChartDataProvider {
  async getCandles(input: CandleRequestInput): Promise<CandlePoint[]> {
    const exchangeSymbol = getExchangeSymbols(input.symbol).okx;

    if (!exchangeSymbol) {
      return [];
    }

    const url = new URL(OKX_CANDLES_URL);

    url.searchParams.set("instId", exchangeSymbol);
    url.searchParams.set("bar", OKX_BAR_BY_TIMEFRAME[input.timeframe]);
    url.searchParams.set("limit", OKX_LIMIT);

    if (input.before) {
      url.searchParams.set("before", String(input.before * 1000));
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[OKX] Fetching candles:", url.toString());
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as OkxCandlesResponse;

    if (payload.code !== "0" || !payload.data) {
      return [];
    }

    return payload.data
      .map(([timestamp, open, high, low, close]) => {
        return {
          time: Math.floor(Number(timestamp) / 1000),
          open: parseNumber(open),
          high: parseNumber(high),
          low: parseNumber(low),
          close: parseNumber(close),
          source: "okx" as const,
        };
      })
      .filter((candle, index, list) => {
        return list.findIndex((item) => item.time === candle.time) === index;
      })
      .sort((first, second) => first.time - second.time);
  }
}
