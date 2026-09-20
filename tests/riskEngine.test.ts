import { RiskEngine } from '../src/risk/RiskEngine';

describe('RiskEngine Unit Tests', () => {
  let riskEngine: RiskEngine;

  beforeEach(() => {
    riskEngine = new RiskEngine();
  });

  test('should calculate fractional Kelly position sizing correctly', () => {
    // 60% win probability, 1.5 win-loss ratio
    // Kelly fraction = (1.5 * 0.6 - 0.4) / 1.5 = 0.5 / 1.5 = 0.3333
    // Quarter Kelly = 0.3333 * 0.25 = 0.0833
    const kelly = riskEngine.calculateKellyFraction(0.60, 1.5);
    expect(kelly).toBeCloseTo(0.0833, 3);
  });

  test('should restrict trade size when single trade allocation cap is breached', () => {
    const portfolioValue = 10000;
    // Proposed size $1500 (> 5% max cap of $500)
    const result = riskEngine.evaluateTradeRisk(1500, 0.70, 2.0, portfolioValue);
    expect(result.allowed).toBe(true);
    expect(result.recommendedPositionSizeUsd).toBeLessThanOrEqual(500);
  });

  test('should trip circuit breaker when max drawdown limit is reached', () => {
    riskEngine.updatePortfolioState(12.0, 600.0); // 12% drawdown > 10% limit
    const result = riskEngine.evaluateTradeRisk(100, 0.80, 2.0, 10000);
    expect(result.allowed).toBe(false);
    expect(result.circuitBreakerActive).toBe(true);
    expect(result.recommendedPositionSizeUsd).toBe(0);
  });
});
