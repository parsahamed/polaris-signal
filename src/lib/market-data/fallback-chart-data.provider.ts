import type { ChartDataProvider } from "@/lib/market-data/chart-data-provider";
import type { CandlePoint, CandleRequestInput } from "@/types/chart.types";

export class FallbackChartDataProvider implements ChartDataProvider {
  constructor(private readonly providers: ChartDataProvider[]) {}

  async getCandles(input: CandleRequestInput): Promise<CandlePoint[]> {
    for (const provider of this.providers) {
      try {
        const candles = await provider.getCandles(input);

        if (candles.length > 0) {
          return candles;
        }

        if (process.env.NODE_ENV === "development") {
          console.log(
            `[Candles] ${provider.constructor.name} returned no candles; trying fallback.`,
          );
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[Candles] ${provider.constructor.name} failed; trying fallback.`,
            error,
          );
        }
      }
    }

    return [];
  }
}
