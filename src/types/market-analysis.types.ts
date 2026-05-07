import type { Signal } from "@/types/signal.types";

export interface PriceZone {
  support: number;
  resistance: number;
}

export interface MarketAnalysisInput {
  symbol: string;
  price: number;
  change24h: number;
  volume?: number;
  zones: PriceZone;
}

export interface MarketAnalysisResult {
  symbol: string;
  price: number;
  change24h: number;
  zones: PriceZone;
  signal: Signal;
}
