type RetryPolicy = {
  max429: number;
  max5xx: number;
  timeoutMs: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(base: number) {
  const j = Math.floor(Math.random() * 100);
  return base + j;
}

async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function httpGetJson(
  url: string,
  init: RequestInit,
  policy: RetryPolicy
): Promise<{ status: number; json?: unknown; text?: string }> {
  let attempt429 = 0;
  let attempt5xx = 0;

  while (true) {
    const res = await fetchWithTimeout(url, init, policy.timeoutMs);
    const status = res.status;

    if (status === 429) {
      if (attempt429 >= policy.max429) {
        const text = await res.text().catch(() => "");
        return { status, text };
      }
      const baseDelay = 500 * Math.pow(2, attempt429);
      await sleep(jitter(baseDelay));
      attempt429++;
      continue;
    }

    if (status >= 500 && status <= 599) {
      if (attempt5xx >= policy.max5xx) {
        const text = await res.text().catch(() => "");
        return { status, text };
      }
      const baseDelay = 400 * Math.pow(2, attempt5xx);
      await sleep(jitter(baseDelay));
      attempt5xx++;
      continue;
    }

    if (status >= 400 && status !== 429) {
      const text = await res.text().catch(() => "");
      return { status, text };
    }

    try {
      const json = await res.json();
      return { status, json };
    } catch {
      const text = await res.text().catch(() => "");
      return { status, text };
    }
  }
}
