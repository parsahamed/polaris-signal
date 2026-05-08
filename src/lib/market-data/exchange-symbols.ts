export interface ExchangeSymbolMapping {
  binance?: string;
  okx?: string;
  coingecko?: string;
}

export const exchangeSymbolsByMarket: Record<string, ExchangeSymbolMapping> = {
  BTC: {
    binance: "BTCUSDT",
    okx: "BTC-USDT",
    coingecko: "bitcoin",
  },
  ETH: {
    binance: "ETHUSDT",
    okx: "ETH-USDT",
    coingecko: "ethereum",
  },
  XAUT: {
    binance: "XAUTUSDT",
    okx: "XAUT-USDT",
    coingecko: "tether-gold",
  },
  USOON: {},
};

export function getExchangeSymbols(symbol: string): ExchangeSymbolMapping {
  return exchangeSymbolsByMarket[symbol.trim().toUpperCase()] ?? {};
}
