import { MasterEfficiencyBenchmarker } from '../src/backtest/MasterSimulator';

describe('Profit Pilot AI Master System Efficiency & Hardware Telemetry Suite', () => {
  test('should benchmark every system module and execute 10,000-trade multi-market simulation', async () => {
    const benchmarker = new MasterEfficiencyBenchmarker();
    const report = await benchmarker.runMasterBenchmark(1000);

    console.log('========================================================================');
    console.log(' 🚀 PROFIT PILOT AI - MASTER SYSTEM EFFICIENCY BENCHMARK REPORT');
    console.log('========================================================================');
    console.log(` Timestamp              : ${report.timestamp}`);
    console.log(` Full System Throughput  : ${report.systemThroughputCyclesPerSec.toLocaleString()} cycles/sec`);
    console.log(` Avg Full System Latency : ${report.avgFullSystemLatencyMs} ms / cycle`);
    console.log(` Heap Memory Usage      : ${report.heapMemoryUsageMb} MB`);
    console.log('------------------------------------------------------------------------');
    console.log(' MODULE-BY-MODULE BENCHMARK RESULTS:');
    console.log('------------------------------------------------------------------------');
    report.moduleBenchmarks.forEach(m => {
      console.log(` • [${m.moduleName.padEnd(28)}] Latency: ${m.avgLatencyMs.toString().padStart(6)} ms | Throughput: ${m.opsPerSecond.toLocaleString().padStart(8)} ops/sec`);
    });
    console.log('------------------------------------------------------------------------');
    console.log(' 10,000-TRADE MULTI-MARKET MONTE CARLO SIMULATION:');
    console.log('------------------------------------------------------------------------');
    console.log(` • Total Simulated Trades : ${report.simulatedPortfolio10kTrades.totalTrades.toLocaleString()}`);
    console.log(` • Win Rate               : ${report.simulatedPortfolio10kTrades.winRatePct}%`);
    console.log(` • Net Profit (USD)       : +$${report.simulatedPortfolio10kTrades.netProfitUsd.toLocaleString()}`);
    console.log(` • Net Profit (INR)       : +₹${report.simulatedPortfolio10kTrades.netProfitInr.toLocaleString()}`);
    console.log(` • Max Drawdown           : ${report.simulatedPortfolio10kTrades.maxDrawdownPct}%`);
    console.log(` • Annualized Sharpe      : ${report.simulatedPortfolio10kTrades.sharpeRatio}`);
    console.log(` • Profit Factor          : ${report.simulatedPortfolio10kTrades.profitFactor}`);
    console.log('========================================================================');

    // System-wide assertions
    expect(report.avgFullSystemLatencyMs).toBeLessThan(1.0);
    expect(report.systemThroughputCyclesPerSec).toBeGreaterThan(1000);
    expect(report.heapMemoryUsageMb).toBeLessThan(300);
  });
});
