export interface ExchangeSymbolMapping {
  binance?: string;
  okx?: string;
}

export const exchangeSymbolsByMarket: Record<string, ExchangeSymbolMapping> = {
  BTC: {
    binance: "BTCUSDT",
    okx: "BTC-USDT",
  },
  ETH: {
    binance: "ETHUSDT",
    okx: "ETH-USDT",
  },
  XAUT: {
    binance: "XAUTUSDT",
    okx: "XAUT-USDT",
  },
  USOON: {},
};

export function getExchangeSymbols(symbol: string): ExchangeSymbolMapping {
  return exchangeSymbolsByMarket[symbol.trim().toUpperCase()] ?? {};
}
