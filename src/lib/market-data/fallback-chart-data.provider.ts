import type { ChartDataProvider } from "@/lib/market-data/chart-data-provider";
import type { CandlePoint, CandleRequestInput } from "@/types/chart.types";

export class FallbackChartDataProvider implements ChartDataProvider {
  constructor(private readonly providers: ChartDataProvider[]) {}

  async getCandles(input: CandleRequestInput): Promise<CandlePoint[]> {
    for (const provider of this.providers) {
      const providerName = provider.constructor.name.replace(
        "ChartDataProvider",
        "",
      );

      try {
        const candles = await provider.getCandles(input);

        if (candles.length > 0) {
          if (process.env.NODE_ENV === "development") {
            console.log(`[ChartProvider] Using ${providerName} candles`);
          }

          return candles;
        }

        if (process.env.NODE_ENV === "development") {
          console.log(
            `[ChartProvider] ${providerName} returned no candles, trying fallback`,
          );
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[ChartProvider] ${providerName} failed, trying fallback`,
            error,
          );
        }
      }
    }

    return [];
  }
}
