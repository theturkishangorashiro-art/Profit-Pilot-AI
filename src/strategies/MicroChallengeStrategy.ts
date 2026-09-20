import { PredictionOrderbook } from '../markets/PredictionMarkets';
import { RiskEngine } from '../risk/RiskEngine';

export interface ChallengeMilestone {
  targetBalanceUsd: number;
  achieved: boolean;
  timestamp?: string;
}

export interface MicroChallengeState {
  active: boolean;
  initialBalanceUsd: number;
  currentBalanceUsd: number;
  peakBalanceUsd: number;
  totalTradesExecuted: number;
  winningTrades: number;
  losingTrades: number;
  netReturnPct: number;
  currentLevel: string;
  nextMilestoneUsd: number;
  milestones: ChallengeMilestone[];
  tradeLog: {
    timestamp: string;
    marketId: string;
    platform: string;
    outcome: string;
    stakeUsd: number;
    pnlUsd: number;
    newBalanceUsd: number;
  }[];
}

export class MicroChallengeStrategy {
  private riskEngine: RiskEngine;
  private state: MicroChallengeState;

  constructor(riskEngine: RiskEngine, startingCapitalUsd: number = 2.0) {
    this.riskEngine = riskEngine;
    this.state = this.createInitialState(startingCapitalUsd);
  }

  private createInitialState(capitalUsd: number): MicroChallengeState {
    return {
      active: true,
      initialBalanceUsd: capitalUsd,
      currentBalanceUsd: capitalUsd,
      peakBalanceUsd: capitalUsd,
      totalTradesExecuted: 0,
      winningTrades: 0,
      losingTrades: 0,
      netReturnPct: 0,
      currentLevel: '🌱 Level 1: Micro Seed ($2)',
      nextMilestoneUsd: 5.0,
      milestones: [
        { targetBalanceUsd: 5.0, achieved: false },
        { targetBalanceUsd: 10.0, achieved: false },
        { targetBalanceUsd: 25.0, achieved: false },
        { targetBalanceUsd: 50.0, achieved: false },
        { targetBalanceUsd: 100.0, achieved: false },
      ],
      tradeLog: [],
    };
  }

  public getState(): MicroChallengeState {
    return this.state;
  }

  public startChallenge(startingCapitalUsd: number = 2.0): MicroChallengeState {
    this.state = this.createInitialState(startingCapitalUsd);
    return this.state;
  }

  public executeMicroTrade(orderbooks: PredictionOrderbook[]): MicroChallengeState {
    if (!this.state.active || this.state.currentBalanceUsd <= 0.10) {
      this.state.active = false;
      return this.state;
    }

    // Dynamic Micro-Kelly sizing: 15% of current compounding balance per micro trade (min $0.10)
    const stakeUsd = Math.max(0.10, Math.min(this.state.currentBalanceUsd * 0.20, 5.0));

    // High EV micro prediction contract simulation (90% win rate arbitrage / mispricing)
    const isWin = Math.random() < 0.90;
    let pnl = 0;

    if (isWin) {
      pnl = stakeUsd * 0.25; // +25% payout on micro binary spread
      this.state.winningTrades++;
    } else {
      pnl = -stakeUsd * 0.10; // -10% stop loss
      this.state.losingTrades++;
    }

    this.state.currentBalanceUsd = Math.round((this.state.currentBalanceUsd + pnl) * 100) / 100;
    this.state.totalTradesExecuted++;
    
    if (this.state.currentBalanceUsd > this.state.peakBalanceUsd) {
      this.state.peakBalanceUsd = this.state.currentBalanceUsd;
    }

    this.state.netReturnPct = Math.round(
      ((this.state.currentBalanceUsd - this.state.initialBalanceUsd) / this.state.initialBalanceUsd) * 1000
    ) / 10;

    // Milestone & Level Evaluation
    this.updateMilestones();

    const selectedBook = orderbooks[0] || { marketId: 'poly_btc_5m', platform: 'Polymarket' };
    this.state.tradeLog.push({
      timestamp: new Date().toISOString(),
      marketId: selectedBook.marketId,
      platform: selectedBook.platform,
      outcome: 'YES',
      stakeUsd: Math.round(stakeUsd * 100) / 100,
      pnlUsd: Math.round(pnl * 100) / 100,
      newBalanceUsd: this.state.currentBalanceUsd,
    });

    if (this.state.tradeLog.length > 50) this.state.tradeLog.shift(); // keep log clean

    return this.state;
  }

  private updateMilestones() {
    const bal = this.state.currentBalanceUsd;

    this.state.milestones.forEach(m => {
      if (!m.achieved && bal >= m.targetBalanceUsd) {
        m.achieved = true;
        m.timestamp = new Date().toISOString();
      }
    });

    if (bal >= 100) {
      this.state.currentLevel = '🏆 Level 5: Master ($100+)';
      this.state.nextMilestoneUsd = 250.0;
    } else if (bal >= 50) {
      this.state.currentLevel = '🔥 Level 4: Expert ($50)';
      this.state.nextMilestoneUsd = 100.0;
    } else if (bal >= 25) {
      this.state.currentLevel = '⚡ Level 3: Advanced ($25)';
      this.state.nextMilestoneUsd = 50.0;
    } else if (bal >= 10) {
      this.state.currentLevel = '🚀 Level 2: Growth ($10)';
      this.state.nextMilestoneUsd = 25.0;
    } else if (bal >= 5) {
      this.state.currentLevel = '🌱 Level 1.5: Seedling ($5)';
      this.state.nextMilestoneUsd = 10.0;
    } else {
      this.state.currentLevel = '🌱 Level 1: Micro Seed ($2)';
      this.state.nextMilestoneUsd = 5.0;
    }
  }
}
