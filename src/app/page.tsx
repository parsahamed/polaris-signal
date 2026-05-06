import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveMarkets } from "@/lib/market-data/market-config.service";

export default function Home() {
  const markets = getActiveMarkets();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Polaris Signal
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Default market configuration for the signal dashboard.
        </p>
      </header>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Markets</CardTitle>
          <CardDescription>
            Active markets loaded through the market config service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {markets.map((market) => (
              <li
                key={market.symbol}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="font-medium">{market.name}</span>
                <span className="text-sm text-muted-foreground">
                  {market.pair}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
