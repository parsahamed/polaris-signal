import { MarketGrid } from "@/components/dashboard/MarketGrid";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Polaris Signal
        </h1>
        <p className="text-sm text-foreground/70">
          Crypto dashboard foundation.
        </p>
      </header>
      <MarketGrid />
    </main>
  );
}
