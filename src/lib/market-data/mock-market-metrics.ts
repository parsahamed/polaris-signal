import type { SignalStatus } from "@/types/signal.types";

export const signalLabels: Record<SignalStatus, string> = {
  bullish: "Bullish",
  neutral: "Neutral",
  bearish: "Bearish",
  danger: "Danger",
};

export function formatMarketNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

export function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
