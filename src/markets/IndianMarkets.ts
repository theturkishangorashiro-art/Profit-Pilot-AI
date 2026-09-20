export interface IndianOptionContract {
  symbol: string;         // e.g. "NIFTY26SEP24500CE" or "BANKNIFTY26SEP52000PE"
  underlying: string;     // "NIFTY", "BANKNIFTY", "RELIANCE"
  strikePrice: number;
  optionType: 'CE' | 'PE';
  expiry: string;
  lastPrice: number;
  iv: number;             // Implied Volatility %
  delta: number;
  gamma: number;
  theta: number;
  openInterest: number;
  volume: number;
}

export interface IndianStockQuote {
  symbol: string;        // "NSE:RELIANCE", "NSE:NIFTY50", "NSE:BANKNIFTY"
  companyName: string;
  lastTradedPrice: number;
  changePct: number;
  high: number;
  low: number;
  volume: number;
  vwap: number;
}

export class IndianMarketConnector {
  public async getStockQuotes(): Promise<IndianStockQuote[]> {
    // Simulated live NSE/BSE Equity & Index data
    return [
      {
        symbol: 'NSE:NIFTY50',
        companyName: 'NIFTY 50 Index',
        lastTradedPrice: 24850.40,
        changePct: 0.75,
        high: 24910.00,
        low: 24780.20,
        volume: 245000000,
        vwap: 24840.10,
      },
      {
        symbol: 'NSE:BANKNIFTY',
        companyName: 'NIFTY Bank Index',
        lastTradedPrice: 51720.80,
        changePct: 1.12,
        high: 51900.00,
        low: 51450.00,
        volume: 180000000,
        vwap: 51690.50,
      },
      {
        symbol: 'NSE:RELIANCE',
        companyName: 'Reliance Industries Ltd.',
        lastTradedPrice: 2985.50,
        changePct: 0.62,
        high: 3010.00,
        low: 2965.00,
        volume: 8500000,
        vwap: 2980.20,
      },
      {
        symbol: 'NSE:TCS',
        companyName: 'Tata Consultancy Services Ltd.',
        lastTradedPrice: 4250.00,
        changePct: -0.35,
        high: 4280.00,
        low: 4230.00,
        volume: 3200000,
        vwap: 4255.10,
      },
    ];
  }

  public async getOptionChain(underlying: 'NIFTY' | 'BANKNIFTY'): Promise<IndianOptionContract[]> {
    const spotPrice = underlying === 'NIFTY' ? 24850 : 51720;
    const atmStrike = Math.round(spotPrice / 100) * 100;

    return [
      // ATM Call (CE)
      {
        symbol: `${underlying}26SEP${atmStrike}CE`,
        underlying,
        strikePrice: atmStrike,
        optionType: 'CE',
        expiry: '2026-09-24',
        lastPrice: 145.20,
        iv: 14.5,
        delta: 0.52,
        gamma: 0.002,
        theta: -12.5,
        openInterest: 1250000,
        volume: 450000,
      },
      // ATM Put (PE)
      {
        symbol: `${underlying}26SEP${atmStrike}PE`,
        underlying,
        strikePrice: atmStrike,
        optionType: 'PE',
        expiry: '2026-09-24',
        lastPrice: 138.80,
        iv: 15.1,
        delta: -0.48,
        gamma: 0.002,
        theta: -11.8,
        openInterest: 1180000,
        volume: 420000,
      },
    ];
  }
}
