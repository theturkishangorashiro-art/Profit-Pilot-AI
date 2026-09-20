import { IndianMarketConnector, IndianOptionContract } from '../markets/IndianMarkets';
import { RiskEngine } from '../risk/RiskEngine';

export interface IndianOptionSignal {
  strategyName: 'DeltaNeutralStraddle' | 'OptionIVSkewArb' | 'EquityMomentumBreakout';
  underlying: string;
  contracts: IndianOptionContract[];
  netPremiumCollectedInr: number;
  recommendedCapitalInr: number;
  expectedThetaDecayDailyInr: number;
  timestamp: string;
}

export class IndianOptionsStrategy {
  private connector: IndianMarketConnector;
  private riskEngine: RiskEngine;

  constructor(riskEngine: RiskEngine) {
    this.riskEngine = riskEngine;
    this.connector = new IndianMarketConnector();
  }

  public async scanIndianOptionStrategies(portfolioValueInr: number = 500000): Promise<IndianOptionSignal[]> {
    const signals: IndianOptionSignal[] = [];
    const optionChain = await this.connector.getOptionChain('NIFTY');

    const ce = optionChain.find(c => c.optionType === 'CE');
    const pe = optionChain.find(c => c.optionType === 'PE');

    if (ce && pe) {
      const combinedPremium = ce.lastPrice + pe.lastPrice;
      const lotSize = 25; // NIFTY lot size
      const netPremiumCollected = combinedPremium * lotSize;
      
      const winProb = 0.72;
      const winLossRatio = 1.2;

      // Evaluate trade risk converting INR allocation to portfolio units
      const riskEval = this.riskEngine.evaluateTradeRisk(
        netPremiumCollected,
        winProb,
        winLossRatio,
        portfolioValueInr / 83 // convert to USD equivalent for engine
      );

      if (riskEval.allowed) {
        signals.push({
          strategyName: 'DeltaNeutralStraddle',
          underlying: 'NIFTY 50',
          contracts: [ce, pe],
          netPremiumCollectedInr: Math.round(netPremiumCollected * 100) / 100,
          recommendedCapitalInr: Math.round(netPremiumCollected * 4 * 100) / 100, // margin buffer
          expectedThetaDecayDailyInr: Math.round(Math.abs(ce.theta + pe.theta) * lotSize * 100) / 100,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return signals;
  }
}
