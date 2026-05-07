import type { MarketDataProvider } from "@/lib/market-data/market-data-provider";
import { MockMarketDataProvider } from "@/lib/market-data/mock-market-data.provider";
import type { MarketData } from "@/types/market-data.types";

const COINGECKO_SIMPLE_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price";

const COINGECKO_IDS_BY_SYMBOL: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  XAUT: "tether-gold",
  USDT_TMN: "tether",
};

const MOCK_ONLY_SYMBOLS = new Set(["USOON"]);

interface CoinGeckoPricePoint {
  usd?: number;
  usd_24h_change?: number;
  usd_24h_vol?: number;
}

type CoinGeckoSimplePriceResponse = Record<string, CoinGeckoPricePoint>;

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

function roundMarketNumber(value: number, precision = 2): number {
  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
}

export class CoinGeckoMarketDataProvider implements MarketDataProvider {
  private readonly fallbackProvider: MarketDataProvider;

  constructor(fallbackProvider: MarketDataProvider = new MockMarketDataProvider()) {
    this.fallbackProvider = fallbackProvider;
  }

  async getMarketData(symbol: string): Promise<MarketData | undefined> {
    const [marketData] = await this.getMarketDataList([symbol]);

    return marketData;
  }

  async getMarketDataList(symbols: string[]): Promise<MarketData[]> {
    const normalizedSymbols = symbols.map((symbol) => {
      return normalizeSymbol(symbol);
    });
    const realDataSymbols = normalizedSymbols.filter((symbol) => {
      return COINGECKO_IDS_BY_SYMBOL[symbol] && !MOCK_ONLY_SYMBOLS.has(symbol);
    });
    const fallbackSymbols = normalizedSymbols.filter((symbol) => {
      return !COINGECKO_IDS_BY_SYMBOL[symbol] || MOCK_ONLY_SYMBOLS.has(symbol);
    });

    const [realMarketData, fallbackMarketData] = await Promise.all([
      this.fetchCoinGeckoMarketData(realDataSymbols),
      this.fallbackProvider.getMarketDataList(fallbackSymbols),
    ]);
    const marketDataBySymbol = new Map<string, MarketData>();

    [...realMarketData, ...fallbackMarketData].forEach((marketData) => {
      marketDataBySymbol.set(marketData.symbol, marketData);
    });

    const missingSymbols = normalizedSymbols.filter((symbol) => {
      return !marketDataBySymbol.has(symbol);
    });
    const missingFallbackData =
      missingSymbols.length > 0
        ? await this.fallbackProvider.getMarketDataList(missingSymbols)
        : [];

    missingFallbackData.forEach((marketData) => {
      marketDataBySymbol.set(marketData.symbol, marketData);
    });

    return normalizedSymbols
      .map((symbol) => {
        return marketDataBySymbol.get(symbol);
      })
      .filter((marketData): marketData is MarketData => {
        return Boolean(marketData);
      });
  }

  private async fetchCoinGeckoMarketData(
    symbols: string[]
  ): Promise<MarketData[]> {
    if (symbols.length === 0) {
      return [];
    }

    try {
      const ids = Array.from(
        new Set(
          symbols.map((symbol) => {
            return COINGECKO_IDS_BY_SYMBOL[symbol];
          })
        )
      );
      const url = new URL(COINGECKO_SIMPLE_PRICE_URL);

      url.searchParams.set("ids", ids.join(","));
      url.searchParams.set("vs_currencies", "usd");
      url.searchParams.set("include_24hr_change", "true");
      url.searchParams.set("include_24hr_vol", "true");

      // CoinGecko is used only for MVP market data and can be swapped later.
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          accept: "application/json",
        },
      });

      if (!response.ok) {
        return this.fallbackProvider.getMarketDataList(symbols);
      }

      const payload =
        (await response.json()) as CoinGeckoSimplePriceResponse;
      const updatedAt = new Date().toISOString();

      return symbols
        .flatMap((symbol) => {
          const coingeckoId = COINGECKO_IDS_BY_SYMBOL[symbol];
          const pricePoint = payload[coingeckoId];

          if (!pricePoint?.usd) {
            return [];
          }

          const marketData: MarketData = {
            symbol,
            price: roundMarketNumber(pricePoint.usd),
            change24h: roundMarketNumber(pricePoint.usd_24h_change ?? 0),
            updatedAt,
          };

          if (typeof pricePoint.usd_24h_vol === "number") {
            marketData.volume24h = roundMarketNumber(pricePoint.usd_24h_vol);
          }

          return [marketData];
        });
    } catch {
      return this.fallbackProvider.getMarketDataList(symbols);
    }
  }
}
