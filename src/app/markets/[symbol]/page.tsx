import { SignalPanel } from "@/components/market/SignalPanel";

export default function MarketPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <h1 className="text-3xl font-semibold text-foreground">
        Market Detail
      </h1>
      <SignalPanel />
    </main>
  );
}
