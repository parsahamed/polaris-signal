import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMarketNumber } from "@/lib/market-data/mock-market-metrics";
import type { MarketTechnicalAnalysis } from "@/types/analysis.types";

interface AnalysisOverviewProps {
  analysis: MarketTechnicalAnalysis;
}

function formatOptionalPrice(value: number | undefined): string {
  return value === undefined ? "Unavailable" : formatMarketNumber(value);
}

function formatLabel(value: string): string {
  return value.replaceAll("-", " ");
}

export function AnalysisOverview({ analysis }: AnalysisOverviewProps) {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>Technical Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="rounded-md border border-border/70 bg-muted/20 p-3 text-muted-foreground">
          {analysis.summary}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground">Trend</p>
            <p className="mt-1 font-medium capitalize">{analysis.trend}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Volatility</p>
            <p className="mt-1 font-medium capitalize">
              {analysis.volatility}
            </p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground">Market structure</p>
            <p className="mt-1 font-medium capitalize">
              {formatLabel(analysis.marketStructure.structure)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Trend strength</p>
            <p className="mt-1 font-medium capitalize">
              {analysis.trendStrength.strength} ({analysis.trendStrength.score})
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Breakout</p>
            <p className="mt-1 font-medium capitalize">
              {formatLabel(analysis.breakout.direction)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume</p>
            <p className="mt-1 font-medium capitalize">
              {analysis.volume.confirmation}
            </p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-muted-foreground">SMA7</p>
            <p className="mt-1 font-medium tabular-nums">
              {formatOptionalPrice(analysis.movingAverages.sma7)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">SMA25</p>
            <p className="mt-1 font-medium tabular-nums">
              {formatOptionalPrice(analysis.movingAverages.sma25)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">SMA99</p>
            <p className="mt-1 font-medium tabular-nums">
              {formatOptionalPrice(analysis.movingAverages.sma99)}
            </p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground">Support</p>
            <p className="mt-1 font-medium tabular-nums">
              {formatOptionalPrice(analysis.supportResistance.support)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Resistance</p>
            <p className="mt-1 font-medium tabular-nums">
              {formatOptionalPrice(analysis.supportResistance.resistance)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
