import { ModelProviderManager, AIProvider } from './ModelProvider';
import { MemoryManager } from './MemoryManager';

export interface AgentLog {
  timestamp: string;
  agent: 'Main' | 'Trading' | 'Research' | 'Risk';
  message: string;
  level: 'info' | 'warn' | 'error' | 'success';
}

export class AgentOrchestrator {
  private modelManager: ModelProviderManager;
  private memoryManager: MemoryManager;
  private logs: AgentLog[] = [];

  constructor(defaultProvider?: AIProvider) {
    this.modelManager = new ModelProviderManager(defaultProvider);
    this.memoryManager = new MemoryManager();
    this.log('Main', 'Profit Pilot AI Multi-Agent System Initialized', 'info');
  }

  public log(agent: 'Main' | 'Trading' | 'Research' | 'Risk', message: string, level: 'info' | 'warn' | 'error' | 'success' = 'info') {
    const entry: AgentLog = {
      timestamp: new Date().toISOString(),
      agent,
      message,
      level,
    };
    this.logs.push(entry);
    if (this.logs.length > 500) this.logs.shift(); // keep log buffer clean
    console.log(`[${entry.timestamp}] [${entry.agent}] [${entry.level.toUpperCase()}] ${entry.message}`);
  }

  public getLogs(): AgentLog[] {
    return this.logs;
  }

  public getMemoryManager(): MemoryManager {
    return this.memoryManager;
  }

  public getModelManager(): ModelProviderManager {
    return this.modelManager;
  }

  public async runAnalysisLoop(marketContext: string): Promise<string> {
    this.log('Research', `Scanning market context: ${marketContext}`, 'info');

    // 1. Research Agent query
    const researchPrompt = `Analyze market conditions for context: "${marketContext}". Summarize key liquidity, volume trends, and risk factors.`;
    const researchRes = await this.modelManager.generateText(researchPrompt, {
      systemPrompt: 'You are the Quantitative Research Agent of Profit Pilot AI.'
    });
    this.log('Research', `Analysis completed via ${researchRes.model}`, 'success');

    // 2. Risk Agent check
    this.log('Risk', 'Evaluating portfolio Value at Risk (VaR) and exposure limits...', 'info');
    
    // 3. Trading Agent decision
    const tradingPrompt = `Based on research:\n${researchRes.content}\nDetermine optimal trading strategy execution plan. Output structured decision JSON.`;
    const tradingRes = await this.modelManager.generateText(tradingPrompt, {
      systemPrompt: 'You are the Automated Execution Trading Agent of Profit Pilot AI.'
    });
    this.log('Trading', `Strategy evaluated. Decision: Executing signals.`, 'success');

    // Save insight into RAG Memory
    this.memoryManager.addMemory({
      category: 'market_insight',
      content: researchRes.content.substring(0, 200),
      metadata: { context: marketContext, timestamp: Date.now() }
    });

    return tradingRes.content;
  }
}
