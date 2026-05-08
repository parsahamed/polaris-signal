import type { ChartDataProvider } from "@/lib/market-data/chart-data-provider";
import { getExchangeSymbols } from "@/lib/market-data/exchange-symbols";
import type {
  CandlePoint,
  CandleRequestInput,
  ChartTimeframe,
} from "@/types/chart.types";

const COINGECKO_COIN_URL = "https://api.coingecko.com/api/v3/coins";

const DAYS_BY_TIMEFRAME: Record<ChartTimeframe, string> = {
  "1H": "1",
  "4H": "1",
  "1D": "1",
  "1W": "7",
};

type CoinGeckoOhlcPoint = [number, number, number, number, number];

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

function roundPrice(value: number): number {
  const precision = value >= 100 ? 0 : 2;
  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
}

export class CoinGeckoChartDataProvider implements ChartDataProvider {
  async getCandles(input: CandleRequestInput): Promise<CandlePoint[]> {
    const coinId = getExchangeSymbols(normalizeSymbol(input.symbol)).coingecko;

    if (!coinId) {
      return [];
    }

    try {
      const url = new URL(`${COINGECKO_COIN_URL}/${coinId}/ohlc`);

      url.searchParams.set("vs_currency", "usd");
      url.searchParams.set("days", DAYS_BY_TIMEFRAME[input.timeframe]);

      if (input.before) {
        // TODO: CoinGecko /ohlc does not support exact historical pagination.
        // Keep this provider boundary so a range-capable source can replace it.
      }

      if (process.env.NODE_ENV === "development") {
        console.log("[CoinGecko] Fetching OHLC candles:", url.toString());
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

      const payload = (await response.json()) as CoinGeckoOhlcPoint[];
      const candles = payload
        .map(([timestamp, open, high, low, close]) => {
          return {
            time: Math.floor(timestamp / 1000),
            open: roundPrice(open),
            high: roundPrice(high),
            low: roundPrice(low),
            close: roundPrice(close),
            source: "coingecko" as const,
          };
        })
        .filter((candle) => {
          return input.before ? Number(candle.time) < input.before : true;
        });

      if (candles.length === 0) {
        return [];
      }

      return candles.filter((candle, index, list) => {
        return list.findIndex((item) => item.time === candle.time) === index;
      });
    } catch {
      return [];
    }
  }
}
