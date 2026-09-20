import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export interface AppConfig {
  port: number;
  host: string;
  env: string;
  defaultAiProvider: 'anthropic' | 'openai' | 'gemini' | 'deepseek' | 'ollama';
  keys: {
    anthropic?: string;
    openai?: string;
    gemini?: string;
    deepseek?: string;
    polymarketApiKey?: string;
    kalshiApiKey?: string;
    solanaPrivateKey?: string;
    evmPrivateKey?: string;
  };
  risk: {
    maxPortfolioDrawdownPct: number;
    maxSingleTradeAllocationPct: number;
    kellySafetyFraction: number;
    circuitBreakerLossUsd: number;
  };
  commerce: {
    agentForumUrl: string;
    x402Networks: string[];
  };
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  env: process.env.NODE_ENV || 'development',
  defaultAiProvider: (process.env.DEFAULT_AI_PROVIDER as any) || 'anthropic',
  keys: {
    anthropic: process.env.ANTHROPIC_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    deepseek: process.env.DEEPSEEK_API_KEY,
    polymarketApiKey: process.env.POLYMARKET_API_KEY,
    kalshiApiKey: process.env.KALSHI_API_KEY,
    solanaPrivateKey: process.env.SOLANA_PRIVATE_KEY,
    evmPrivateKey: process.env.EVM_PRIVATE_KEY,
  },
  risk: {
    maxPortfolioDrawdownPct: parseFloat(process.env.MAX_PORTFOLIO_DRAWDOWN_PCT || '10.0'),
    maxSingleTradeAllocationPct: parseFloat(process.env.MAX_SINGLE_TRADE_ALLOCATION_PCT || '5.0'),
    kellySafetyFraction: parseFloat(process.env.KELLY_CRITERION_SAFETY_FRACTION || '0.25'),
    circuitBreakerLossUsd: parseFloat(process.env.CIRCUIT_BREAKER_TRIGGERED_LOSS_USD || '500.0'),
  },
  commerce: {
    agentForumUrl: process.env.AGENT_FORUM_API_URL || 'https://api.cloddsbot.com',
    x402Networks: (process.env.X402_PAYMENT_NETWORKS || 'solana,base').split(','),
  },
};
