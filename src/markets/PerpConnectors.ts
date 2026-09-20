export interface PerpPosition {
  symbol: string;
  exchange: 'Hyperliquid' | 'Binance' | 'Bybit';
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  unrealizedPnlUsd: number;
  liquidationPrice: number;
}

export class PerpConnector {
  public async getPositions(): Promise<PerpPosition[]> {
    return [
      {
        symbol: 'BTC-PERP',
        exchange: 'Hyperliquid',
        side: 'LONG',
        size: 0.25,
        entryPrice: 94200,
        markPrice: 95100,
        leverage: 10,
        unrealizedPnlUsd: 225.0,
        liquidationPrice: 85000,
      },
      {
        symbol: 'SOL-PERP',
        exchange: 'Hyperliquid',
        side: 'SHORT',
        size: 15.0,
        entryPrice: 188.5,
        markPrice: 184.2,
        leverage: 5,
        unrealizedPnlUsd: 64.5,
        liquidationPrice: 220.0,
      },
    ];
  }
}
