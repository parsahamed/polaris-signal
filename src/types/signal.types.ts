export type SignalStatus = "bullish" | "neutral" | "bearish" | "danger";

export type RiskLevel = "low" | "medium" | "high";

export interface Signal {
  status: SignalStatus;
  confidence: number;
  riskLevel: RiskLevel;
  reasons: string[];
}
