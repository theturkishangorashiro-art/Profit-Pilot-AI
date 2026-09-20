import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { config } from '../config';
import { AgentOrchestrator } from '../agents/Orchestrator';
import { RiskEngine } from '../risk/RiskEngine';
import { StrategyEngine } from '../strategies/StrategyEngine';
import { HighEfficiencyEngine } from '../strategies/HighEfficiencyEngine';
import { AgentForumClient } from '../commerce/AgentForumClient';
import { X402ProtocolHandler } from '../commerce/x402Protocol';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Core Instances
const orchestrator = new AgentOrchestrator();
const riskEngine = new RiskEngine();
const strategyEngine = new StrategyEngine(orchestrator, riskEngine);
const highEfficiencyEngine = new HighEfficiencyEngine();
const forumClient = new AgentForumClient();
const x402Handler = new X402ProtocolHandler();

// Simulated portfolio telemetry state
let portfolioState = {
  totalBalanceUsd: 12450.75,
  dailyPnlUsd: 384.20,
  dailyPnlPct: 3.18,
  winRatePct: 74.2,
  activePositionsCount: 4,
  currentDrawdownPct: 1.2,
  circuitBreakerActive: false,
};

// WebSocket Broadcast
function broadcastTelemetry() {
  const payload = JSON.stringify({
    type: 'TELEMETRY_UPDATE',
    data: {
      portfolio: portfolioState,
      logs: orchestrator.getLogs().slice(-20),
      memories: orchestrator.getMemoryManager().getAllMemories(),
      provider: orchestrator.getModelManager(),
    },
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Periodic background strategy runner (every 5s)
setInterval(async () => {
  try {
    await strategyEngine.runStrategyCycle();
    // Micro updates to simulated telemetry for dynamic dashboard demo
    portfolioState.totalBalanceUsd += (Math.random() * 2 - 0.5);
    portfolioState.dailyPnlUsd += (Math.random() * 1.5 - 0.3);
    broadcastTelemetry();
  } catch (err: any) {
    orchestrator.log('Main', `Error in strategy loop: ${err.message}`, 'error');
  }
}, 5000);

// API Routes
app.get('/api/efficiency', (req, res) => {
  res.json({ metrics: highEfficiencyEngine.getEfficiencyMetrics() });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    system: 'Profit Pilot AI',
    version: '2.0.0',
    provider: config.defaultAiProvider,
    uptimeSeconds: Math.floor(process.uptime()),
    portfolio: portfolioState,
  });
});

app.get('/api/logs', (req, res) => {
  res.json({ logs: orchestrator.getLogs() });
});

app.get('/api/forum/threads', async (req, res) => {
  const threads = await forumClient.fetchPopularThreads();
  res.json({ threads });
});

app.post('/api/agent/prompt', async (req, res) => {
  const { prompt, provider } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (provider) {
    orchestrator.getModelManager().setActiveProvider(provider);
  }

  const result = await orchestrator.runAnalysisLoop(prompt);
  broadcastTelemetry();
  res.json({ result, logs: orchestrator.getLogs().slice(-5) });
});

app.get('/api/indian-markets', async (req, res) => {
  const indianConnector = new (require('../markets/IndianMarkets').IndianMarketConnector)();
  const quotes = await indianConnector.getStockQuotes();
  const optionChain = await indianConnector.getOptionChain('NIFTY');
  res.json({ quotes, optionChain });
});

app.post('/api/challenge/start', (req, res) => {
  const { capital } = req.body;
  const startingCapital = parseFloat(capital || '2.0');
  const state = strategyEngine.getMicroChallenge().startChallenge(startingCapital);
  orchestrator.log('Trading', `Started $${startingCapital} Automatic Micro Prediction Challenge!`, 'success');
  broadcastTelemetry();
  res.json({ status: 'Challenge started successfully', state });
});

app.get('/api/challenge/status', (req, res) => {
  const state = strategyEngine.getMicroChallenge().getState();
  res.json({ state });
});

app.post('/api/risk/circuit-breaker/reset', (req, res) => {
  riskEngine.resetCircuitBreaker();
  portfolioState.circuitBreakerActive = false;
  portfolioState.currentDrawdownPct = 0;
  orchestrator.log('Risk', 'Circuit breaker reset manually by operator.', 'warn');
  broadcastTelemetry();
  res.json({ status: 'Circuit breaker reset successfully' });
});

// x402 Micropayment Monetized Endpoint Example
app.get('/api/premium-signal', (req, res) => {
  const authHeader = req.headers['x-payment-signature'] as string;
  if (!x402Handler.verifyPaymentHeader(authHeader)) {
    const challenge = x402Handler.createPaymentChallenge('/api/premium-signal', 0.25, 'solana');
    return res.status(402).json(challenge);
  }

  res.json({
    signal: 'STRONG_BUY_POLYMARKET_BTC_95K',
    confidence: 0.96,
    expectedReturnUsd: 145.0,
    timestamp: new Date().toISOString(),
  });
});

// Fallback to Web UI index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Start Server
const PORT = config.port;
server.listen(PORT, config.host, () => {
  console.log(`=======================================================`);
  console.log(` Profit Pilot AI v2.0.0 Control Center Running!`);
  console.log(` Local UI & API: http://localhost:${PORT}`);
  console.log(` WebSocket Telemetry: ws://localhost:${PORT}`);
  console.log(` Default AI Provider: ${config.defaultAiProvider.toUpperCase()}`);
  console.log(`=======================================================`);
});
