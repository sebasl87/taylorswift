/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from "@vercel/kv";

const BASE_URL = "https://api.setlist.fm/rest/1.0";

type Song = { name: string; tape: boolean; info?: string | null };

type ShowDetail = {
  id: string;
  eventDate: string; // dd-mm-yyyy
  eventDateISO: string; // yyyy-mm-dd
  lastUpdated?: string | null;
  tour?: string | null;
  venue: { id: string; name: string; url?: string | null };
  city: { name: string; state?: string | null };
  country: { code?: string | null; name?: string | null };
  songs: Song[];
  url?: string | null;
};

type Cached<T> = { fetchedAt: number; value: T };

function ddmmyyyyToISO(ddmmyyyy: string): string | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(ddmmyyyy);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeDetail(item: any): ShowDetail | null {
  const iso = ddmmyyyyToISO(item?.eventDate);
  if (!item?.id || !iso) return null;

  const venue = item?.venue ?? {};
  const city = venue?.city ?? {};
  const country = city?.country ?? {};

  // setlist.fm: sets.set[] y adentro song[]
  const sets = item?.sets?.set;
  const allSongs: any[] = Array.isArray(sets)
    ? sets.flatMap((s: any) => (Array.isArray(s?.song) ? s.song : []))
    : [];

  const songs: Song[] = allSongs
    .map((s) => ({
      name: s?.name ?? "",
      tape: Boolean(s?.tape),
      info: s?.info ?? null,
    }))
    .filter((s) => s.name);

  return {
    id: item.id,
    eventDate: item.eventDate,
    eventDateISO: iso,
    lastUpdated: item?.lastUpdated ?? null,
    tour: item?.tour?.name ?? null,
    venue: { id: venue?.id ?? "", name: venue?.name ?? "", url: venue?.url ?? null },
    city: { name: city?.name ?? "", state: city?.state ?? null },
    country: { code: country?.code ?? null, name: country?.name ?? null },
    songs,
    url: item?.url ?? null,
  };
}

async function upstreamFetchJson(pathWithQuery: string) {
  const apiKey = process.env.SETLISTFM_API_KEY;
  if (!apiKey) throw new Error("Missing SETLISTFM_API_KEY");

  const res = await fetch(`${BASE_URL}${pathWithQuery}`, {
    headers: { "x-api-key": apiKey, Accept: "application/json" },
    cache: "no-store",
  });

  if (res.status === 429) {
    const text = await res.text().catch(() => "");
    return { ok: false as const, status: 429, bodyText: text };
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false as const, status: res.status, bodyText: text };
  }

  const json = await res.json();
  return { ok: true as const, status: res.status, json };
}

async function getWithKvFreshStale<T>(opts: {
  key: string;
  freshSeconds: number;
  keepSeconds: number;
  fetcher: () => Promise<T>;
}) {
  const { key, freshSeconds, keepSeconds, fetcher } = opts;

  const cached = await kv.get<Cached<T>>(key);
  const now = Date.now();

  if (cached) {
    const ageSeconds = (now - cached.fetchedAt) / 1000;
    if (ageSeconds <= freshSeconds) {
      return { value: cached.value, cache: "fresh" as const };
    }
  }

  try {
    const value = await fetcher();
    const payload: Cached<T> = { fetchedAt: now, value };
    await kv.set(key, payload, { ex: keepSeconds });
    return { value, cache: cached ? "refreshed" : "miss" as const };
  } catch (e: any) {
    if (cached) {
      return { value: cached.value, cache: "stale" as const, error: String(e?.message ?? e) };
    }
    throw e;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { id: queryId } = req.query;
  const id = Array.isArray(queryId) ? queryId[0] : queryId;

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  // Detalle: cache largo (casi no cambia) y anti-429.
  // fresh 24h, keep 30d
  const freshSeconds = 24 * 60 * 60;
  const keepSeconds = 30 * 24 * 60 * 60;

  const key = `setlist:show:${id}`;

  // Mock data if API key is missing
  if (!process.env.SETLISTFM_API_KEY) {
    console.warn("Missing SETLISTFM_API_KEY, returning mock data");
    const mockShow: ShowDetail = {
      id,
      eventDate: "04-02-2024",
      eventDateISO: "2024-02-04",
      lastUpdated: new Date().toISOString(),
      tour: "The Eras Tour",
      venue: { id: "venue-id", name: "Mock Venue", url: "#" },
      city: { name: "Mock City", state: "State" },
      country: { code: "US", name: "United States" },
      songs: [
        { name: "Mock Song 1", tape: false },
        { name: "Mock Song 2", tape: false },
      ],
      url: "#",
    };
    return res.status(200).json({
      ...mockShow,
      meta: { id, cache: { mode: "mock" } }
    });
  }

  try {
    const result = await getWithKvFreshStale({
      key,
      freshSeconds,
      keepSeconds,
      fetcher: async () => {
        const upstream = await upstreamFetchJson(`/setlist/${id}`);

        if (!upstream.ok) {
          const err = new Error(
            upstream.status === 429 ? "Upstream rate limit (429)" : `Upstream error (${upstream.status})`
          );
          (err as any).status = upstream.status;
          (err as any).details = upstream.bodyText;
          throw err;
        }

        const detail = normalizeDetail(upstream.json);
        if (!detail) {
          const err = new Error("Show not found / invalid payload");
          (err as any).status = 404;
          throw err;
        }

        return detail;
      },
    });

    res.status(200).json({
      ...result.value,
      meta: {
        id,
        cache: {
          key,
          mode: result.cache,
          freshSeconds,
          keepSeconds,
        },
      },
    });
  } catch (e: any) {
    const status = Number(e?.status) || 500;
    res.status(status).json({
      error: "Unexpected error",
      details: String(e?.details ?? e?.message ?? e),
      meta: { id, key },
    });
  }
}
