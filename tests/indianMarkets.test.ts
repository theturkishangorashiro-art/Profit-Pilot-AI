import { IndianMarketConnector } from '../src/markets/IndianMarkets';
import { IndianOptionsStrategy } from '../src/strategies/IndianOptionsStrategy';
import { RiskEngine } from '../src/risk/RiskEngine';

describe('Indian Markets & F&O Options Suite', () => {
  let connector: IndianMarketConnector;
  let riskEngine: RiskEngine;
  let indianStrategy: IndianOptionsStrategy;

  beforeEach(() => {
    connector = new IndianMarketConnector();
    riskEngine = new RiskEngine();
    indianStrategy = new IndianOptionsStrategy(riskEngine);
  });

  test('should fetch Indian stock quotes for NSE/BSE equities & indices', async () => {
    const quotes = await connector.getStockQuotes();
    expect(quotes.length).toBeGreaterThan(0);
    const nifty = quotes.find(q => q.symbol === 'NSE:NIFTY50');
    expect(nifty).toBeDefined();
    expect(nifty?.lastTradedPrice).toBeGreaterThan(20000);
  });

  test('should fetch option chain and calculate theta decay for NIFTY straddle', async () => {
    const signals = await indianStrategy.scanIndianOptionStrategies(500000);
    expect(signals.length).toBeGreaterThan(0);
    expect(signals[0].underlying).toBe('NIFTY 50');
    expect(signals[0].netPremiumCollectedInr).toBeGreaterThan(0);
    expect(signals[0].expectedThetaDecayDailyInr).toBeGreaterThan(0);
  });
});
