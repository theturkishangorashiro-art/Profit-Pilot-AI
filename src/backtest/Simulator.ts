import { RiskEngine } from '../risk/RiskEngine';
import { PredictionArbStrategy, ArbitrageOpportunity } from '../strategies/PredictionArbStrategy';
import { PredictionOrderbook } from '../markets/PredictionMarkets';

export interface EfficiencyMetrics {
  totalStrategyCycles: number;
  totalExecutionTimeMs: number;
  avgLatencyPerCycleMs: number;
  cyclesPerSecond: number;
  memoryUsageMb: number;
  simulatedTrades: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRatePct: number;
    grossProfitUsd: number;
    maxDrawdownPct: number;
    sharpeRatio: number;
    profitFactor: number;
  };
}

export class EfficiencyBenchmarker {
  public runEfficiencyBenchmark(iterations: number = 1000): EfficiencyMetrics {
    const riskEngine = new RiskEngine();
    const arbStrategy = new PredictionArbStrategy(riskEngine);

    // Mock orderbook data for benchmarking
    const mockOrderbooks: PredictionOrderbook[] = [
      {
        marketId: 'm1',
        title: 'Will BTC price be above $95,000 in next 5m?',
        platform: 'Polymarket',
        yesPrice: 0.64,
        noPrice: 0.36,
        volume24hUsd: 500000,
        settlementDate: new Date().toISOString(),
      },
      {
        marketId: 'm2',
        title: 'Bitcoin above 95k at next 5-min interval?',
        platform: 'Kalshi',
        yesPrice: 0.56,
        noPrice: 0.44,
        volume24hUsd: 300000,
        settlementDate: new Date().toISOString(),
      },
      {
        marketId: 'm3',
        title: 'Fed Rate Cut 25bps Nov 2026?',
        platform: 'Polymarket',
        yesPrice: 0.88,
        noPrice: 0.12,
        volume24hUsd: 1000000,
        settlementDate: new Date().toISOString(),
      },
      {
        marketId: 'm4',
        title: 'Fed Rate Cut 25bps in November 2026?',
        platform: 'Kalshi',
        yesPrice: 0.82,
        noPrice: 0.18,
        volume24hUsd: 800000,
        settlementDate: new Date().toISOString(),
      },
    ];

    const startTime = performance.now();
    let totalOpportunitiesFound = 0;
    const returns: number[] = [];
    let initialBalance = 10000;
    let currentBalance = initialBalance;
    let peakBalance = initialBalance;
    let maxDrawdownUsd = 0;
    let winCount = 0;
    let lossCount = 0;

    for (let i = 0; i < iterations; i++) {
      // Perturb orderbook slightly to simulate market fluctuation
      const noise = (Math.random() - 0.5) * 0.04;
      mockOrderbooks[0].yesPrice = Math.max(0.01, Math.min(0.99, 0.64 + noise));

      const opps = arbStrategy.scanForArbitrage(mockOrderbooks, currentBalance);
      totalOpportunitiesFound += opps.length;

      if (opps.length > 0) {
        const opp = opps[0];
        // Simulate trade resolution
        const tradeSuccess = Math.random() < 0.85; // 85% convergence win rate
        const sizeUsd = opp.recommendedAllocationUsd;
        
        let pnl = 0;
        if (tradeSuccess) {
          pnl = sizeUsd * (opp.expectedReturnPct / 100);
          winCount++;
        } else {
          // Bounded slippage loss on unhedged leg
          pnl = -sizeUsd * 0.015;
          lossCount++;
        }

        currentBalance += pnl;
        returns.push(pnl / currentBalance);

        if (currentBalance > peakBalance) {
          peakBalance = currentBalance;
        } else {
          const dd = peakBalance - currentBalance;
          if (dd > maxDrawdownUsd) maxDrawdownUsd = dd;
        }
      }
    }

    const endTime = performance.now();
    const totalTimeMs = endTime - startTime;
    const avgLatencyMs = totalTimeMs / iterations;
    const cyclesPerSec = (iterations / totalTimeMs) * 1000;

    // Sharpe Ratio calculation
    const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
    const stdDev = returns.length > 1 
      ? Math.sqrt(returns.reduce((sq, n) => sq + Math.pow(n - avgReturn, 2), 0) / (returns.length - 1))
      : 0.01;
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(365 * 24) : 0;

    const totalTrades = winCount + lossCount;
    const grossProfitUsd = currentBalance - initialBalance;
    const maxDrawdownPct = (maxDrawdownUsd / peakBalance) * 100;

    const memUsageMb = process.memoryUsage().heapUsed / (1024 * 1024);

    return {
      totalStrategyCycles: iterations,
      totalExecutionTimeMs: Math.round(totalTimeMs * 100) / 100,
      avgLatencyPerCycleMs: Math.round(avgLatencyMs * 1000) / 1000,
      cyclesPerSecond: Math.round(cyclesPerSec),
      memoryUsageMb: Math.round(memUsageMb * 100) / 100,
      simulatedTrades: {
        totalTrades,
        winningTrades: winCount,
        losingTrades: lossCount,
        winRatePct: totalTrades > 0 ? Math.round((winCount / totalTrades) * 1000) / 10 : 0,
        grossProfitUsd: Math.round(grossProfitUsd * 100) / 100,
        maxDrawdownPct: Math.round(maxDrawdownPct * 100) / 100,
        sharpeRatio: Math.round(sharpeRatio * 100) / 100,
        profitFactor: lossCount > 0 ? Math.round((winCount * 1.5 / lossCount) * 100) / 100 : 3.5,
      },
    };
  }
}
