import { mockMarketData } from "@/lib/market-data/mock-market-data";
import type { ChartPoint } from "@/types/chart.types";

const POINT_COUNT = 24;

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

export function getMockChartData(symbol: string): ChartPoint[] {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const marketData = mockMarketData.find((item) => {
    return item.symbol === normalizedSymbol;
  });
  const basePrice = marketData?.price ?? 100;
  const seed = getSymbolSeed(normalizedSymbol);
  const direction = seed % 2 === 0 ? 1 : -1;

  return Array.from({ length: POINT_COUNT }, (_, index) => {
    const time = `${String(index).padStart(2, "0")}:00`;
    const wave = Math.sin((index + seed) * 0.62) * 0.012;
    const trend = ((index - POINT_COUNT / 2) / POINT_COUNT) * 0.028 * direction;
    const marketBias = ((seed % 9) - 4) * 0.0015;

    return {
      time,
      price: roundPrice(basePrice * (1 + wave + trend + marketBias)),
    };
  });
}
