// Cache implementation
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setInCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL_MS,
  });
}

// HTTP Utils
const DEFAULT_TIMEOUT = 8000;

interface RequestOptions extends RequestInit {
  timeout?: number;
}

export class ProviderError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ProviderError';
    this.statusCode = statusCode;
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchWithRetry(url: string, options: RequestOptions = {}): Promise<any> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  let attempts = 0;
  const maxRetries429 = 3;
  const maxRetries5xx = 2;

  while (true) {
    attempts++;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (response.ok) {
        // Handle JSON response
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return await response.json();
        }
        return await response.text();
      }

      // Error handling logic
      const status = response.status;

      // 429: Too Many Requests
      if (status === 429) {
        if (attempts <= maxRetries429) {
          // Exponential backoff + jitter
          const backoff = Math.pow(2, attempts) * 1000;
          const jitter = Math.random() * 1000;
          await sleep(backoff + jitter);
          continue;
        }
      }

      // 5xx: Server Errors
      if (status >= 500 && status < 600) {
        if (attempts <= maxRetries5xx) {
          await sleep(1000 * attempts); // Simple linear backoff for 5xx
          continue;
        }
      }

      // If we're here, we failed and shouldn't retry (or ran out of retries)
      throw new ProviderError(`Request failed with status ${status}: ${response.statusText}`, status);

    } catch (error: unknown) {
      if ((error as Error).name === 'AbortError') {
        throw new ProviderError(`Request timed out after ${timeout}ms`, 408);
      }

      // If it's already our error, rethrow
      if (error instanceof ProviderError) throw error;

      // Network errors (fetch failed) - treat as 5xx equivalent for retry purposes?
      // For now, let's retry network errors a couple of times like 5xx
      if (attempts <= maxRetries5xx) {
        await sleep(1000 * attempts);
        continue;
      }

      throw new ProviderError(`Network error: ${(error as Error).message}`);
    }
  }
}
