import { MicroChallengeStrategy } from '../src/strategies/MicroChallengeStrategy';
import { RiskEngine } from '../src/risk/RiskEngine';
import { PredictionOrderbook } from '../src/markets/PredictionMarkets';

describe('$2 Micro Prediction Market Challenge Suite', () => {
  let riskEngine: RiskEngine;
  let challenge: MicroChallengeStrategy;

  beforeEach(() => {
    riskEngine = new RiskEngine();
    challenge = new MicroChallengeStrategy(riskEngine, 2.0);
  });

  test('should initialize challenge with $2.00 starting balance', () => {
    const state = challenge.getState();
    expect(state.initialBalanceUsd).toBe(2.0);
    expect(state.currentBalanceUsd).toBe(2.0);
    expect(state.currentLevel).toContain('Level 1');
    expect(state.nextMilestoneUsd).toBe(5.0);
  });

  test('should execute micro trades and advance milestone levels upon capital growth', () => {
    const mockOrderbooks: PredictionOrderbook[] = [
      {
        marketId: 'poly_btc_5m',
        title: 'Will BTC price be above $95,000 in next 5m?',
        platform: 'Polymarket',
        yesPrice: 0.65,
        noPrice: 0.35,
        volume24hUsd: 100000,
        settlementDate: new Date().toISOString(),
      },
    ];

    // Execute 50 compounding micro trade cycles
    for (let i = 0; i < 50; i++) {
      challenge.executeMicroTrade(mockOrderbooks);
    }

    const state = challenge.getState();
    expect(state.totalTradesExecuted).toBe(50);
    expect(state.currentBalanceUsd).toBeGreaterThan(2.0);
    expect(state.tradeLog.length).toBeGreaterThan(0);
  });
});
