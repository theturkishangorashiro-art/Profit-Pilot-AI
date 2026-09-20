import { PredictionArbStrategy } from '../src/strategies/PredictionArbStrategy';
import { RiskEngine } from '../src/risk/RiskEngine';
import { PredictionOrderbook } from '../src/markets/PredictionMarkets';

describe('PredictionArbStrategy Unit Tests', () => {
  let riskEngine: RiskEngine;
  let arbStrategy: PredictionArbStrategy;

  beforeEach(() => {
    riskEngine = new RiskEngine();
    arbStrategy = new PredictionArbStrategy(riskEngine);
  });

  test('should detect price spread arbitrage between Polymarket and Kalshi', () => {
    const orderbooks: PredictionOrderbook[] = [
      {
        marketId: 'poly_1',
        title: 'Will BTC price be above $95,000 in next 5m?',
        platform: 'Polymarket',
        yesPrice: 0.65,
        noPrice: 0.35,
        volume24hUsd: 100000,
        settlementDate: new Date().toISOString(),
      },
      {
        marketId: 'kalshi_1',
        title: 'Bitcoin above 95k at next 5-min interval?',
        platform: 'Kalshi',
        yesPrice: 0.55,
        noPrice: 0.45,
        volume24hUsd: 80000,
        settlementDate: new Date().toISOString(),
      },
    ];

    const opportunities = arbStrategy.scanForArbitrage(orderbooks, 10000);
    expect(opportunities.length).toBe(1);
    expect(opportunities[0].spreadPct).toBe(10.0);
    expect(opportunities[0].recommendedAllocationUsd).toBeGreaterThan(0);
  });
});
