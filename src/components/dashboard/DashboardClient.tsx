"use client";

import { MarketGrid } from "@/components/dashboard/MarketGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketsQuery } from "@/hooks/use-market-queries";

function DashboardHeader({ isFetching }: { isFetching: boolean }) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold tracking-tight">Polaris Signal</h1>
      <p className="text-sm text-muted-foreground">
        Market overview {isFetching ? "(refreshing...)" : null}
      </p>
    </header>
  );
}

function DashboardSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="border-border/70">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-8 w-28" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function DashboardClient() {
  const { data: items = [], error, isError, isFetching, isLoading } =
    useMarketsQuery();

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10">
        <DashboardHeader isFetching={false} />
        <DashboardSkeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10">
        <DashboardHeader isFetching={false} />
        <Card className="border-border/70">
          <CardContent className="p-6 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Failed to load markets."}
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <DashboardHeader isFetching={isFetching} />
      {items.length > 0 ? (
        <MarketGrid items={items} />
      ) : (
        <Card className="border-border/70">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No markets available.
          </CardContent>
        </Card>
      )}
    </main>
  );
}
