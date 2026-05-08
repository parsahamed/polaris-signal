import type { TrendDirection } from "@/lib/analysis/indicators/trend";
import type { VolatilityLevel } from "@/lib/analysis/indicators/volatility";
import type { ChartTimeframe } from "@/types/chart.types";

export type MarketStructure =
  | "higher-highs-higher-lows"
  | "lower-highs-lower-lows"
  | "sideways"
  | "mixed"
  | "insufficient-data";

export type BreakoutDirection =
  | "breakout-up"
  | "breakout-down"
  | "no-breakout";

export type TrendStrength = "weak" | "moderate" | "strong";

export type VolumeConfirmation = "confirmed" | "weak" | "unavailable";

export interface SwingPoint {
  index: number;
  time: number;
  price: number;
  type: "high" | "low";
}

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

export interface MarketStructureAnalysis {
  structure: MarketStructure;
  swingHighs: SwingPoint[];
  swingLows: SwingPoint[];
  higherHighsCount: number;
  higherLowsCount: number;
  lowerHighsCount: number;
  lowerLowsCount: number;
}

export interface BreakoutAnalysis {
  direction: BreakoutDirection;
  level?: number;
  distancePercent?: number;
}

export interface TrendStrengthAnalysis {
  strength: TrendStrength;
  score: number;
}

export interface VolumeAnalysis {
  confirmation: VolumeConfirmation;
  recentVolume?: number;
  averageVolume?: number;
}

export interface TimeframeAnalysisSummary {
  timeframe: ChartTimeframe;
  summary: string;
}

export interface MarketTechnicalAnalysis {
  symbol: string;
  currentPrice: number;
  movingAverages: MovingAverageAnalysis;
  supportResistance: SupportResistanceAnalysis;
  volatility: VolatilityLevel;
  trend: TrendDirection;
  marketStructure: MarketStructureAnalysis;
  breakout: BreakoutAnalysis;
  trendStrength: TrendStrengthAnalysis;
  volume: VolumeAnalysis;
  summary: string;
  reasons: string[];
}
