import { Activity, ArrowRight, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary">
          <Activity className="size-5" />
          <span className="text-sm font-medium">Design system preview</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Polaris Signal
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Dark-first fintech primitives for the crypto signal dashboard.
        </p>
      </header>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Signal Surface</CardTitle>
          <CardDescription>
            Base components, tokens, and status treatments.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <Button>
              Primary
              <ArrowRight />
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Danger</Button>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Badge className="border-success/30 bg-success/15 text-success">
              Bullish
            </Badge>
            <Badge variant="outline">Neutral</Badge>
            <Badge className="border-warning/30 bg-warning/15 text-warning">
              Bearish
            </Badge>
            <Badge variant="destructive">Danger</Badge>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter className="gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Ready for dashboard composition.
        </CardFooter>
      </Card>
    </main>
  );
}
