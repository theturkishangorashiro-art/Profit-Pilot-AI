export interface MemoryEntry {
  id: string;
  timestamp: number;
  category: 'trade' | 'market_insight' | 'risk_event' | 'strategy_note';
  content: string;
  metadata?: Record<string, any>;
}

export class MemoryManager {
  private memories: MemoryEntry[] = [];

  constructor() {
    this.seedInitialMemories();
  }

  private seedInitialMemories() {
    this.addMemory({
      category: 'market_insight',
      content: 'Short-term prediction market binary contracts exhibit highest price variance 15 minutes prior to settlement cycles.',
      metadata: { market: 'Polymarket', strategy: 'PredictionArb' }
    });
    this.addMemory({
      category: 'risk_event',
      content: 'Solana DEX slippage spikes during high network congestion; Jito tip prioritization mandatory for atomic transactions.',
      metadata: { chain: 'Solana', component: 'Jupiter' }
    });
  }

  public addMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): MemoryEntry {
    const newEntry: MemoryEntry = {
      ...entry,
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    this.memories.push(newEntry);
    return newEntry;
  }

  public queryMemories(query: string, limit: number = 5): MemoryEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.memories
      .filter(m => m.content.toLowerCase().includes(lowerQuery) || m.category.toLowerCase().includes(lowerQuery))
      .slice(-limit);
  }

  public getAllMemories(): MemoryEntry[] {
    return [...this.memories];
  }
}
