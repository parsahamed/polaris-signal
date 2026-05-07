import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  signalLabels,
} from "@/lib/market-data/mock-market-metrics";
import { cn } from "@/lib/utils";
import type { RiskLevel, SignalStatus } from "@/types/signal.types";

interface SignalPanelProps {
  signal: SignalStatus;
  confidence: number;
  riskLevel: RiskLevel;
  reasons: string[];
}

const signalClasses: Record<SignalStatus, string> = {
  bullish: "border-success/30 bg-success/15 text-success",
  neutral: "border-border bg-secondary text-secondary-foreground",
  bearish: "border-red-500/30 bg-red-500/15 text-red-300",
  danger: "",
};

export function SignalPanel({
  signal,
  confidence,
  riskLevel,
  reasons,
}: SignalPanelProps) {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Signal</CardTitle>
            <CardDescription>Signal engine v1 market insight.</CardDescription>
          </div>
          <Badge
            variant={signal === "danger" ? "destructive" : "outline"}
            className={cn(signalClasses[signal])}
          >
            {signalLabels[signal]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Confidence</p>
            <p className="mt-1 font-medium tabular-nums">{confidence}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Risk level</p>
            <p className="mt-1 font-medium capitalize">{riskLevel}</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
