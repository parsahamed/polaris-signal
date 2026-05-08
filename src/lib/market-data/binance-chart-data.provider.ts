import type { ChartDataProvider } from "@/lib/market-data/chart-data-provider";
import { getExchangeSymbols } from "@/lib/market-data/exchange-symbols";
import type {
  CandlePoint,
  CandleRequestInput,
  ChartTimeframe,
} from "@/types/chart.types";

const BINANCE_KLINES_URL = "https://api.binance.com/api/v3/klines";
const BINANCE_LIMIT = "200";

const BINANCE_INTERVAL_BY_TIMEFRAME: Record<ChartTimeframe, string> = {
  "1H": "1h",
  "4H": "4h",
  "1D": "1d",
  "1W": "1w",
};

type BinanceKline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  ...unknown[],
];

function parseNumber(value: string): number {
  return Number(value);
}

export class BinanceChartDataProvider implements ChartDataProvider {
  async getCandles(input: CandleRequestInput): Promise<CandlePoint[]> {
    const exchangeSymbol = getExchangeSymbols(input.symbol).binance;

    if (!exchangeSymbol) {
      return [];
    }

    const url = new URL(BINANCE_KLINES_URL);

    url.searchParams.set("symbol", exchangeSymbol);
    url.searchParams.set("interval", BINANCE_INTERVAL_BY_TIMEFRAME[input.timeframe]);
    url.searchParams.set("limit", BINANCE_LIMIT);

    if (input.before) {
      url.searchParams.set("endTime", String(input.before * 1000));
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[Binance] Fetching candles:", url.toString());
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

    const payload = (await response.json()) as BinanceKline[];

    return payload
      .map(([openTime, open, high, low, close, volume]) => {
        return {
          time: Math.floor(openTime / 1000),
          open: parseNumber(open),
          high: parseNumber(high),
          low: parseNumber(low),
          close: parseNumber(close),
          volume: parseNumber(volume),
          source: "binance" as const,
        };
      })
      .filter((candle, index, list) => {
        return list.findIndex((item) => item.time === candle.time) === index;
      })
      .sort((first, second) => first.time - second.time);
  }
}
