import { PredictionOrderbook } from '../markets/PredictionMarkets';
import { RiskEngine } from '../risk/RiskEngine';

export interface ArbitrageOpportunity {
  id: string;
  marketA: PredictionOrderbook;
  marketB: PredictionOrderbook;
  impliedProbA: number;
  impliedProbB: number;
  spreadPct: number;
  expectedReturnPct: number;
  recommendedAllocationUsd: number;
  timestamp: string;
}

export class PredictionArbStrategy {
  private riskEngine: RiskEngine;

  constructor(riskEngine: RiskEngine) {
    this.riskEngine = riskEngine;
  }

  public scanForArbitrage(
    orderbooks: PredictionOrderbook[],
    portfolioValueUsd: number = 10000
  ): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];

    // Group matching event topics (e.g. BTC 95k)
    for (let i = 0; i < orderbooks.length; i++) {
      for (let j = i + 1; j < orderbooks.length; j++) {
        const bookA = orderbooks[i];
        const bookB = orderbooks[j];

        // Simple topic similarity matching
        if (this.areMarketsSimilar(bookA.title, bookB.title)) {
          const spreadPct = Math.abs(bookA.yesPrice - bookB.yesPrice) * 100;

          if (spreadPct >= 3.0) { // minimum 3% threshold
            const winProb = 0.85; // high convergence probability for arbitrage spread
            const winLossRatio = 1.0; // risk-hedged 1:1 arbitrage payout ratio
            const riskEval = this.riskEngine.evaluateTradeRisk(
              portfolioValueUsd * 0.05,
              winProb,
              winLossRatio,
              portfolioValueUsd
            );

            if (riskEval.allowed && riskEval.recommendedPositionSizeUsd > 0) {
              opportunities.push({
                id: `arb_${Date.now()}_${i}_${j}`,
                marketA: bookA,
                marketB: bookB,
                impliedProbA: bookA.yesPrice,
                impliedProbB: bookB.yesPrice,
                spreadPct: Math.round(spreadPct * 100) / 100,
                expectedReturnPct: Math.round((spreadPct - 0.5) * 100) / 100, // subtracting fee buffer
                recommendedAllocationUsd: riskEval.recommendedPositionSizeUsd,
                timestamp: new Date().toISOString(),
              });
            }
          }
        }
      }
    }

    return opportunities;
  }

  private areMarketsSimilar(titleA: string, titleB: string): boolean {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length >= 2 && !['will', 'price', 'be', 'in', 'at', 'next', 'the'].includes(w));

    const wordsA = normalize(titleA);
    const wordsB = normalize(titleB);
    const matches = wordsA.filter(w => wordsB.includes(w) || wordsB.some(wb => wb.includes(w) || w.includes(wb)));
    return matches.length >= 1;
  }
}
