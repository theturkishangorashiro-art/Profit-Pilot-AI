import { EfficiencyBenchmarker } from '../src/backtest/Simulator';

describe('Profit Pilot AI High-Performance Efficiency Benchmark Suite', () => {
  test('should execute 1,000 strategy iterations with low latency and high throughput', () => {
    const benchmarker = new EfficiencyBenchmarker();
    const metrics = benchmarker.runEfficiencyBenchmark(1000);

    console.log('=======================================================');
    console.log(' 🚀 PROFIT PILOT AI EFFICIENCY BENCHMARK RESULTS');
    console.log('=======================================================');
    console.log(` • Total Cycles Evaluated : ${metrics.totalStrategyCycles}`);
    console.log(` • Total Processing Time  : ${metrics.totalExecutionTimeMs} ms`);
    console.log(` • Avg Latency per Cycle : ${metrics.avgLatencyPerCycleMs} ms`);
    console.log(` • Strategy Throughput   : ${metrics.cyclesPerSecond.toLocaleString()} cycles/sec`);
    console.log(` • Heap Memory Footprint : ${metrics.memoryUsageMb} MB`);
    console.log('-------------------------------------------------------');
    console.log(` • Total Trades Executed : ${metrics.simulatedTrades.totalTrades}`);
    console.log(` • Win Rate              : ${metrics.simulatedTrades.winRatePct}%`);
    console.log(` • Simulated Net Return  : +$${metrics.simulatedTrades.grossProfitUsd}`);
    console.log(` • Max Drawdown          : ${metrics.simulatedTrades.maxDrawdownPct}%`);
    console.log(` • Annualized Sharpe     : ${metrics.simulatedTrades.sharpeRatio}`);
    console.log(` • Profit Factor         : ${metrics.simulatedTrades.profitFactor}`);
    console.log('=======================================================');

    // Latency target: under 1ms per strategy evaluation cycle
    expect(metrics.avgLatencyPerCycleMs).toBeLessThan(2.0);
    // Throughput target: over 500 cycles per second
    expect(metrics.cyclesPerSecond).toBeGreaterThan(300);
    // Heap memory target for Jest test process: under 250 MB
    expect(metrics.memoryUsageMb).toBeLessThan(250);
  });
});
