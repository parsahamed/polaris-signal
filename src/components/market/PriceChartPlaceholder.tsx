import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PriceChartPlaceholder() {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
          Chart placeholder
        </div>
      </CardContent>
    </Card>
  );
}
