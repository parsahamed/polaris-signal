import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMarketNumber } from "@/lib/market-data/mock-market-metrics";

interface SupportResistanceProps {
  support: number;
  resistance: number;
}

export function SupportResistance({
  support,
  resistance,
}: SupportResistanceProps) {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>Support / Resistance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Support zone</span>
          <span className="font-medium tabular-nums">
            {formatMarketNumber(support)}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Resistance zone</span>
          <span className="font-medium tabular-nums">
            {formatMarketNumber(resistance)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
