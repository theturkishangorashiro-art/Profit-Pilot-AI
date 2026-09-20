# 🚀 PROFIT PILOT AI

```
  _____  _____   ____  ______ _____ _______   _____ _____ _      ____ _______ 
 |  __ \|  __ \ / __ \|  ____|_   _|__   __| |  __ \_   _| |    / __ \__   __|
 | |__) | |__) | |  | | |__    | |    | |    | |__) || | | |   | |  | | | |   
 |  ___/|  _  /| |  | |  __|   | |    | |    |  ___/ | | | |   | |  | | | |   
 | |    | | \ \| |__| | |     _| |_   | |    | |    _| |_| |___| |__| | | |   
 |_|    |_|  \_\\____/|_|    |_____|  |_|    |_|   |_____|______\____/  |_|   
```

> **Next-Generation Autonomous AI Trading Autopilot for Global Markets**
> Operates across Prediction Markets, Indian Equities (NSE/BSE) & F&O Options, Crypto Perpetuals, Solana & EVM DEXs, and x402 Agent Payments with Multi-Model AI Reasoning.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## 🌟 What is Profit Pilot AI?

**Profit Pilot AI** is an enterprise-grade evolution of open-source autonomous trading agent systems inspired by CloddsBot. It combines **universal multi-model LLM agent orchestration** (Claude 3.5, OpenAI GPT-4o, Gemini 1.5/2.0, DeepSeek V3/R1, and local Ollama) with a high-throughput quantitative execution engine, real-time risk controls, an interactive Glassmorphism Control Center Web UI, and native machine-to-machine payment capabilities (**x402 protocol**).

---

## 🚀 Key Improvements Over Baseline CloddsBot

| Feature Area | Baseline CloddsBot | 🚀 Profit Pilot AI (v2.0) |
| :--- | :--- | :--- |
| **AI Agent Model Core** | Claude-centric single model loop | **Universal Multi-LLM Orchestrator** (Claude, GPT-4o, Gemini, DeepSeek, Ollama) with dynamic failover |
| **User Interface** | CLI & WebChat basic view | **Glassmorphism Executive Control Center UI** with real-time portfolio charts & live agent logs |
| **Risk Management** | Basic loss caps & static rules | **Dynamic VaR/CVaR Risk Engine**, Quarter-Kelly Sizing, and sub-millisecond Circuit Breakers |
| **Prediction Arbitrage** | Orderbook monitoring | **Instant Cross-Market Arbitrage Scanner & Auto-Executor** (Polymarket vs. Kalshi vs. Manifold) |
| **MEV Protection** | Standard RPC calls | **Integrated Jito Solana Bundles & Flashbots EVM Private Relay** routing |
| **Machine Economy** | Basic token launch | **Full HTTP 402 Payment Required (x402)** client/server protocol for USDC micropayments |
| **Developer Experience** | Custom deployment | **One-Click Docker Compose**, full TypeScript typings, and automated Jest test suites |

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    GLASSMORPHISM CONTROL CENTER UI & API SERVER               │
│  Express HTTP Server • WebSocket Telemetry Stream • Live Interactive Dashboard│
└──────────────────────────────────────────┬───────────────────────────────────┘
                                           │
┌──────────────────────────────────────────┴───────────────────────────────────┐
│                    UNIVERSAL MULTI-LLM AGENT ORCHESTRATOR                    │
│  Main Router • Research Agent • Trading Execution Agent • Risk Guard Agent  │
│  Models: Claude 3.5 Sonnet • GPT-4o • Gemini 1.5 Pro • DeepSeek V3 • Ollama  │
│  Hybrid RAG Memory (LanceDB Vector Store & Relational Cache)                  │
└──────────────────────────────────────────┬───────────────────────────────────┘
                                           │
┌──────────────────────────────────────────┴───────────────────────────────────┐
│                   UNIFIED STRATEGY & REAL-TIME RISK ENGINE                   │
│  Value at Risk (VaR 95%) • CVaR • Kelly Position Sizing • Circuit Breaker   │
│  Prediction Market Arbitrage • Solana DBC Sniper • Funding Rate Arbitrage   │
└──────────────────────────────────────────┬───────────────────────────────────┘
                                           │
    ┌──────────────────────┬──────────────┼──────────────┬──────────────────────┐
    ▼                      ▼              ▼              ▼                      ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
│ PREDICTION       │ │ SOLANA DeFi  │ │ EVM DeFi     │ │ PERPETUAL   │ │ x402 AGENT   │
│ MARKETS          │ │              │ │              │ │ FUTURES     │ │ ECONOMY      │
├──────────────────┤ ├──────────────┤ ├──────────────┤ ├─────────────┤ ├──────────────┤
│ Polymarket CLOB  │ │ Jupiter V6   │ │ Uniswap V3   │ │ Hyperliquid │ │ HTTP 402     │
│ Kalshi API       │ │ Raydium      │ │ 1inch        │ │ Binance     │ │ Payments     │
│ Manifold         │ │ Meteora DBC  │ │ Base / Arb   │ │ Bybit       │ │ Agent Forum  │
│ Predict.fun      │ │ Jito Bundles │ │ Flashbots    │ │ Synthetix   │ │ Marketplace  │
└──────────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ └──────────────┘
```

---

## 🛠 Quick Start Guide

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- *(Optional)* **Docker & Docker Compose**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your API keys:
```bash
cp .env.example .env
```

### 3. Build & Run Locally
```bash
# Compile TypeScript codebase
npm run build

# Launch server in development mode
npm run dev

# Or launch production server
npm start
```
Access the Control Center Dashboard at `http://localhost:3000`.

---

## 🐳 Run with Docker

Launch the containerized stack instantly:
```bash
docker-compose up -d --build
```

---

## 🧪 Testing

Run the comprehensive unit test suite:
```bash
npm test
```

---

## 🆓 How to Run Profit Pilot AI Completely Free ($0/mo)

You can run Profit Pilot AI 24/7 with zero API or cloud hosting costs by combining free local models, free cloud API tiers, free cloud servers, and free market RPCs:

### 1. Zero-Cost AI Models (Free Inference)
- **Local Ollama (100% Free & Unlimited)**:
  Download [Ollama](https://ollama.com) and run open-source reasoning models on your computer:
  ```bash
  ollama run llama3
  # Or run DeepSeek reasoning model:
  ollama run deepseek-r1:8b
  ```
  Set in your `.env`:
  ```env
  DEFAULT_AI_PROVIDER=ollama
  OLLAMA_BASE_URL=http://localhost:11434
  ```
- **Google Gemini API Free Tier**:
  Get a free API key at [Google AI Studio](https://aistudio.google.com). Gemini 1.5 Flash provides up to 15 requests/min and 1,000,000 tokens/min at $0 cost.
  ```env
  DEFAULT_AI_PROVIDER=gemini
  GEMINI_API_KEY=AIzaSy...
  ```
- **OpenRouter Free Tier Models**:
  Use free models like `google/gemma-2-9b-it:free` or `meta-llama/llama-3.1-8b-instruct:free`.

### 2. Zero-Cost 24/7 Hosting
- **Oracle Cloud "Always Free" Tier**:
  Get an Ampere ARM instance with **4 OCPUs and 24 GB RAM for 100% free forever**. This is powerful enough to run both Profit Pilot AI and Ollama simultaneously 24/7.
- **Local Self-Hosting**:
  Run on your existing Mac/Windows PC or Raspberry Pi using Docker:
  ```bash
  docker-compose up -d
  ```

### 3. Zero-Cost Market Data & RPCs
- **Polymarket & Kalshi**: Public API endpoints for price feeds, orderbooks, and settlement polling are 100% free with no monthly subscription.
- **Crypto DEX RPCs**: Use free RPC endpoints from Ankr, Cloudflare, or official public RPCs (`api.mainnet-beta.solana.com`, `mainnet.base.org`).
- **Hyperliquid & Binance**: Public REST and WebSocket orderbook data are free to stream.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
