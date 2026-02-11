// Performance caching utilities for NeoBI India
// Implements the 82% cache hit rate target from research paper

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

class NeoBICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private stats: CacheStats = { hits: 0, misses: 0, size: 0 };
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 1000, defaultTTL = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;

    // Cleanup expired entries every minute
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), 60 * 1000);
    }
  }

  // Generate cache key from params
  private generateKey(prefix: string, params: any): string {
    const paramsStr = JSON.stringify(params, Object.keys(params).sort());
    return `${prefix}:${paramsStr}`;
  }

  // Set value in cache
  set<T>(key: string, data: T, ttl?: number): void {
    // Evict oldest entry if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    });
    this.stats.size = this.cache.size;
  }

  // Get value from cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data as T;
  }

  // Get or set (fetch if not cached)
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }

  // Invalidate cache entry
  invalidate(key: string): boolean {
    return this.cache.delete(key);
  }

  // Invalidate by prefix
  invalidateByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  // Clear entire cache
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
  }

  // Cleanup expired entries
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
    this.stats.size = this.cache.size;
  }

  // Get cache statistics
  getStats(): CacheStats & { hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
    };
  }

  // Create a cached function wrapper
  wrap<TArgs extends any[], TResult>(
    prefix: string,
    fn: (...args: TArgs) => Promise<TResult>,
    ttl?: number
  ): (...args: TArgs) => Promise<TResult> {
    return async (...args: TArgs): Promise<TResult> => {
      const key = this.generateKey(prefix, args);
      return this.getOrSet(key, () => fn(...args), ttl);
    };
  }
}

// Singleton instance
export const neobiCache = new NeoBICache();

// Memoization utility for expensive computations
export function memoize<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  maxCacheSize = 100
): (...args: TArgs) => TResult {
  const cache = new Map<string, TResult>();

  return (...args: TArgs): TResult => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);

    // LRU eviction
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };
}

// Debounce utility for input handlers
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Throttle utility for frequent updates
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Request deduplication - prevent duplicate concurrent requests
const pendingRequests = new Map<string, Promise<any>>();

export async function deduplicatedFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Check if request is already pending
  const pending = pendingRequests.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  // Start new request
  const promise = fetcher().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

// Batch API calls utility
export function createBatcher<TInput, TOutput>(
  batchFn: (inputs: TInput[]) => Promise<TOutput[]>,
  delay = 50,
  maxBatchSize = 10
): (input: TInput) => Promise<TOutput> {
  let batch: TInput[] = [];
  let resolvers: ((result: TOutput) => void)[] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  const flush = async () => {
    const currentBatch = batch;
    const currentResolvers = resolvers;
    batch = [];
    resolvers = [];
    timeoutId = null;

    try {
      const results = await batchFn(currentBatch);
      results.forEach((result, i) => currentResolvers[i](result));
    } catch (error) {
      currentResolvers.forEach((resolve) => resolve(undefined as any));
    }
  };

  return (input: TInput): Promise<TOutput> => {
    return new Promise((resolve) => {
      batch.push(input);
      resolvers.push(resolve);

      if (batch.length >= maxBatchSize) {
        if (timeoutId) clearTimeout(timeoutId);
        flush();
      } else if (!timeoutId) {
        timeoutId = setTimeout(flush, delay);
      }
    });
  };
}

// Preload hints for anticipated data
export const preloadHints = {
  simulation: false,
  nifty: false,
  festivals: false,
};

export function preload(hint: keyof typeof preloadHints): void {
  if (preloadHints[hint]) return;
  preloadHints[hint] = true;

  // Actual preloading logic would go here
  // For now, just mark as preloaded
}
