import type { TrendDirection } from "@/lib/analysis/indicators/trend";
import type { VolatilityLevel } from "@/lib/analysis/indicators/volatility";

export interface MovingAverageAnalysis {
  sma7?: number;
  sma25?: number;
  sma99?: number;
}

export interface SupportResistanceAnalysis {
  support?: number;
  resistance?: number;
}

export interface TrendAnalysis {
  trend: TrendDirection;
}

export interface MarketTechnicalAnalysis {
  symbol: string;
  currentPrice: number;
  movingAverages: MovingAverageAnalysis;
  supportResistance: SupportResistanceAnalysis;
  volatility: VolatilityLevel;
  trend: TrendDirection;
  reasons: string[];
}
