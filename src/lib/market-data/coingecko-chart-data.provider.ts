import type { ChartDataProvider } from "@/lib/market-data/chart-data-provider";
import { MockChartDataProvider } from "@/lib/market-data/mock-chart-data.provider";
import type { CandlePoint, ChartTimeframe } from "@/types/chart.types";

const COINGECKO_COIN_URL = "https://api.coingecko.com/api/v3/coins";

const COINGECKO_IDS_BY_SYMBOL: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  XAUT: "tether-gold",
};

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

function formatCandleTime(timestamp: number, timeframe: ChartTimeframe): string {
  const date = new Date(timestamp);

  if (timeframe === "1W") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

export class CoinGeckoChartDataProvider implements ChartDataProvider {
  private readonly fallbackProvider: ChartDataProvider;

  constructor(fallbackProvider: ChartDataProvider = new MockChartDataProvider()) {
    this.fallbackProvider = fallbackProvider;
  }

  async getCandles(input: {
    symbol: string;
    timeframe: ChartTimeframe;
  }): Promise<CandlePoint[]> {
    const symbol = normalizeSymbol(input.symbol);
    const coinId = COINGECKO_IDS_BY_SYMBOL[symbol];

    if (!coinId) {
      return this.fallbackProvider.getCandles(input);
    }

    try {
      const url = new URL(`${COINGECKO_COIN_URL}/${coinId}/ohlc`);

      url.searchParams.set("vs_currency", "usd");
      url.searchParams.set("days", DAYS_BY_TIMEFRAME[input.timeframe]);

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
        return this.fallbackProvider.getCandles(input);
      }

      const payload = (await response.json()) as CoinGeckoOhlcPoint[];
      const candles = payload.map(([timestamp, open, high, low, close]) => {
        return {
          time: formatCandleTime(timestamp, input.timeframe),
          open: roundPrice(open),
          high: roundPrice(high),
          low: roundPrice(low),
          close: roundPrice(close),
        };
      });

      if (candles.length === 0) {
        return this.fallbackProvider.getCandles(input);
      }

      return candles;
    } catch {
      return this.fallbackProvider.getCandles(input);
    }
  }
}
