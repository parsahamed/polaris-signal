import type { MarketAnalysisInput } from "@/types/market-analysis.types";
import type { Signal } from "@/types/signal.types";

const NEAR_ZONE_THRESHOLD = 0.02;

function isWithinThreshold(value: number, target: number): boolean {
  return Math.abs(value - target) / target <= NEAR_ZONE_THRESHOLD;
}

export function calculateSignal(input: MarketAnalysisInput): Signal {
  const {
    price,
    zones: { support, resistance },
  } = input;

  if (price < support) {
    return {
      status: "danger",
      riskLevel: "high",
      confidence: 80,
      reasons: ["Price is below the support zone"],
    };
  }

  if (price > resistance) {
    return {
      status: "bullish",
      riskLevel: "medium",
      confidence: 70,
      reasons: [
        "Price has moved above resistance, showing possible breakout behavior",
      ],
    };
  }

  if (isWithinThreshold(price, support)) {
    return {
      status: "bullish",
      riskLevel: "medium",
      confidence: 65,
      reasons: ["Price is near the support zone where buyers may defend"],
    };
  }

  if (isWithinThreshold(price, resistance)) {
    return {
      status: "bearish",
      riskLevel: "medium",
      confidence: 65,
      reasons: ["Price is near the resistance zone where sellers may defend"],
    };
  }

  return {
    status: "neutral",
    riskLevel: "low",
    confidence: 50,
    reasons: ["Price is trading between support and resistance"],
  };
}
