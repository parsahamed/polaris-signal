import { mockMarketData } from "@/lib/market-data/mock-market-data";
import type { ChartDataProvider } from "@/lib/market-data/chart-data-provider";
import type {
  CandlePoint,
  CandleRequestInput,
  ChartTimeframe,
} from "@/types/chart.types";

const POINTS_BY_TIMEFRAME: Record<ChartTimeframe, number> = {
  "1H": 12,
  "4H": 16,
  "1D": 24,
  "1W": 28,
};

function getSymbolSeed(symbol: string): number {
  return symbol.split("").reduce((total, character) => {
    return total + character.charCodeAt(0);
  }, 0);
}

function roundPrice(value: number): number {
  const precision = value >= 100 ? 0 : 2;
  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
}

export class MockChartDataProvider implements ChartDataProvider {
  async getCandles(input: CandleRequestInput): Promise<CandlePoint[]> {
    const normalizedSymbol = input.symbol.trim().toUpperCase();
    const marketData = mockMarketData.find((item) => {
      return item.symbol === normalizedSymbol;
    });
    const basePrice = marketData?.price ?? 100;
    const seed = getSymbolSeed(normalizedSymbol);
    const pointCount = POINTS_BY_TIMEFRAME[input.timeframe];
    const direction = seed % 2 === 0 ? 1 : -1;
    const intervalSeconds = input.timeframe === "1W" ? 21600 : 3600;
    const endTime = input.before
      ? input.before - intervalSeconds
      : Math.floor(Date.now() / 1000);
    const startTime = endTime - (pointCount - 1) * intervalSeconds;

    return Array.from({ length: pointCount }, (_, index) => {
      const wave = Math.sin((index + seed) * 0.62) * 0.012;
      const trend = ((index - pointCount / 2) / pointCount) * 0.028 * direction;
      const marketBias = ((seed % 9) - 4) * 0.0015;
      const close = basePrice * (1 + wave + trend + marketBias);
      const open = close * (1 - Math.sin(index + seed) * 0.004);
      const high = Math.max(open, close) * 1.006;
      const low = Math.min(open, close) * 0.994;

      return {
        time: startTime + index * intervalSeconds,
        open: roundPrice(open),
        high: roundPrice(high),
        low: roundPrice(low),
        close: roundPrice(close),
      };
    });
  }
}
