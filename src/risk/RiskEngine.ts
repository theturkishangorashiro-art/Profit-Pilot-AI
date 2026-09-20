import { config } from '../config';

export interface KellyParams {
  winProbability: number; // e.g. 0.60
  winLossRatio: number;   // e.g. 1.5 (payout per unit risked)
  portfolioValueUsd: number;
}

export interface RiskEvaluationResult {
  allowed: boolean;
  reason?: string;
  recommendedPositionSizeUsd: number;
  portfolioVarUsd: number;
  cvarUsd: number;
  circuitBreakerActive: boolean;
}

export class RiskEngine {
  private currentDrawdownPct: number = 0;
  private totalRealizedLossTodayUsd: number = 0;
  private isCircuitBreakerTripped: boolean = false;

  constructor() {
    this.checkCircuitBreaker();
  }

  public updatePortfolioState(currentDrawdownPct: number, realizedLossTodayUsd: number) {
    this.currentDrawdownPct = currentDrawdownPct;
    this.totalRealizedLossTodayUsd = realizedLossTodayUsd;
    this.checkCircuitBreaker();
  }

  private checkCircuitBreaker() {
    if (this.currentDrawdownPct >= config.risk.maxPortfolioDrawdownPct) {
      this.isCircuitBreakerTripped = true;
    }
    if (this.totalRealizedLossTodayUsd >= config.risk.circuitBreakerLossUsd) {
      this.isCircuitBreakerTripped = true;
    }
  }

  public resetCircuitBreaker() {
    this.isCircuitBreakerTripped = false;
    this.currentDrawdownPct = 0;
    this.totalRealizedLossTodayUsd = 0;
  }

  public calculateKellyFraction(p: number, b: number): number {
    if (p <= 0 || b <= 0) return 0;
    const q = 1 - p;
    const rawKelly = (b * p - q) / b;
    if (rawKelly <= 0) return 0;
    // Apply fractional Kelly for drawdown control
    return rawKelly * config.risk.kellySafetyFraction;
  }

  public evaluateTradeRisk(
    proposedSizeUsd: number,
    winProbability: number,
    winLossRatio: number,
    portfolioValueUsd: number
  ): RiskEvaluationResult {
    if (this.isCircuitBreakerTripped) {
      return {
        allowed: false,
        reason: 'Circuit breaker is ACTIVE. Max drawdown or loss limit breached.',
        recommendedPositionSizeUsd: 0,
        portfolioVarUsd: portfolioValueUsd * 0.05,
        cvarUsd: portfolioValueUsd * 0.08,
        circuitBreakerActive: true,
      };
    }

    const kellyFraction = this.calculateKellyFraction(winProbability, winLossRatio);
    const maxAllowedSizeUsd = portfolioValueUsd * (config.risk.maxSingleTradeAllocationPct / 100);
    const rawKellySizeUsd = portfolioValueUsd * kellyFraction;

    const recommendedPositionSizeUsd = Math.min(rawKellySizeUsd, maxAllowedSizeUsd);

    if (proposedSizeUsd > recommendedPositionSizeUsd) {
      return {
        allowed: true,
        reason: `Proposed size $${proposedSizeUsd} capped to safe Kelly recommended allocation $${recommendedPositionSizeUsd.toFixed(2)}`,
        recommendedPositionSizeUsd: Math.round(recommendedPositionSizeUsd * 100) / 100,
        portfolioVarUsd: Math.round(portfolioValueUsd * 0.02 * 100) / 100,
        cvarUsd: Math.round(portfolioValueUsd * 0.035 * 100) / 100,
        circuitBreakerActive: false,
      };
    }

    return {
      allowed: true,
      recommendedPositionSizeUsd: Math.round(proposedSizeUsd * 100) / 100,
      portfolioVarUsd: Math.round(portfolioValueUsd * 0.02 * 100) / 100,
      cvarUsd: Math.round(portfolioValueUsd * 0.035 * 100) / 100,
      circuitBreakerActive: false,
    };
  }
}
