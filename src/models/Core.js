class Core {
  constructor(id) {
    this.id = id;
    this.status = 'idle'; // 'idle', 'running', 'waiting', 'blocked'
    this.currentTask = null;
    this.cache = {}; // Simulate per-core cache (address: value)
    this.stats = {
      executed: 0,      // Number of tasks executed
      utilization: 0,   // Utilization percentage (updated by simulator)
      cacheHits: 0,     // Cache hit count
      cacheMisses: 0,   // Cache miss count
      sliceRemaining: null, // For round-robin quantum countdown
    };
  }
}

export default Core;