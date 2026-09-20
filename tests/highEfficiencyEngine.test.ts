import { HighEfficiencyEngine } from '../src/strategies/HighEfficiencyEngine';

describe('HighEfficiencyEngine Optimization Suite', () => {
  let engine: HighEfficiencyEngine;

  beforeEach(() => {
    engine = new HighEfficiencyEngine();
  });

  test('should filter and prioritize high-EV trade opportunities', () => {
    const rawOps = [
      { id: '1', market: 'Polymarket', strategyName: 'Arb', expectedValueUsd: 15.0, winProbability: 0.90, executionLatencyMs: 0.5, riskScore: 1.5 },
      { id: '2', market: 'Kalshi', strategyName: 'Misprice', expectedValueUsd: 2.0, winProbability: 0.60, executionLatencyMs: 5.0, riskScore: 8.0 },
      { id: '3', market: 'Hyperliquid', strategyName: 'DeltaNeutral', expectedValueUsd: 45.0, winProbability: 0.95, executionLatencyMs: 0.2, riskScore: 1.0 },
    ];

    const optimized = engine.optimizeOpportunityScan(rawOps);

    expect(optimized.length).toBe(2);
    expect(optimized[0].id).toBe('3'); // Highest EV / Latency ratio
    expect(optimized[1].id).toBe('1');
  });

  test('should return composite efficiency metrics', () => {
    const metrics = engine.getEfficiencyMetrics();
    expect(metrics.compositeEfficiencyRatePct).toBeGreaterThan(95.0);
    expect(metrics.winRatePct).toBeGreaterThan(90.0);
    expect(metrics.sharpeRatio).toBeGreaterThan(3.0);
  });
});
