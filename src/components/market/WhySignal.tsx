import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WhySignalProps {
  reasons: string[];
}

export function WhySignal({ reasons }: WhySignalProps) {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>Why this signal?</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
