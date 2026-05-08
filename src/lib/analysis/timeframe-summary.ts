import type {
  MarketTechnicalAnalysis,
  TimeframeAnalysisSummary,
} from "@/types/analysis.types";
import type { ChartTimeframe } from "@/types/chart.types";

interface SummarizeTimeframeAnalysisInput {
  timeframe: ChartTimeframe;
  analysis: MarketTechnicalAnalysis;
}

const timeframeLabels: Record<ChartTimeframe, string> = {
  "1H": "1H",
  "4H": "4H",
  "1D": "Daily",
  "1W": "Long-term",
};

function structureLabel(analysis: MarketTechnicalAnalysis): string {
  if (analysis.marketStructure.structure === "higher-highs-higher-lows") {
    return "bullish";
  }

  if (analysis.marketStructure.structure === "lower-highs-lower-lows") {
    return "bearish";
  }

  if (analysis.marketStructure.structure === "insufficient-data") {
    return "limited";
  }

  return analysis.marketStructure.structure;
}

export function summarizeTimeframeAnalysis({
  timeframe,
  analysis,
}: SummarizeTimeframeAnalysisInput): TimeframeAnalysisSummary {
  if (analysis.marketStructure.structure === "insufficient-data") {
    return {
      timeframe,
      summary: `${timeframeLabels[timeframe]} analysis is limited because real candle history is insufficient.`,
    };
  }

  const breakoutText =
    analysis.breakout.direction === "no-breakout"
      ? "no confirmed breakout"
      : analysis.breakout.direction.replace("-", " ");

  return {
    timeframe,
    summary: `${timeframeLabels[timeframe]} structure is ${structureLabel(analysis)}, with ${analysis.volatility} volatility, ${analysis.trendStrength.strength} trend strength, and ${breakoutText}.`,
  };
}
