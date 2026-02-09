import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const BASE_URL = "https://api.setlist.fm/rest/1.0";
const DEFAULT_MBID = "20244d07-534f-4eff-b4d4-930878889970"; // Taylor Swift

type TourCard = {
  id: string;
  eventDate: string; // dd-mm-yyyy
  eventDateISO: string; // yyyy-mm-dd
  tour: string | null;
  venue: { id: string; name: string; url?: string | null };
  city: { name: string; state?: string | null };
  country: { code?: string | null; name?: string | null };
  url?: string | null;
};

type Cached<T> = {
  fetchedAt: number; // ms
  value: T;
};

interface ErrorWithStatus extends Error {
  status?: number;
  details?: string;
}

function ddmmyyyyToISO(ddmmyyyy: string): string | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(ddmmyyyy);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCard(item: any): TourCard | null {
  const iso = ddmmyyyyToISO(item?.eventDate);
  if (!item?.id || !iso) return null;

  const venue = item?.venue ?? {};
  const city = venue?.city ?? {};
  const country = city?.country ?? {};

  return {
    id: item.id,
    eventDate: item.eventDate,
    eventDateISO: iso,
    tour: item?.tour?.name ?? null,
    venue: {
      id: venue?.id ?? "",
      name: venue?.name ?? "",
      url: venue?.url ?? null,
    },
    city: {
      name: city?.name ?? "",
      state: city?.state ?? null,
    },
    country: {
      code: country?.code ?? null,
      name: country?.name ?? null,
    },
    url: item?.url ?? null,
  };
}

async function upstreamFetchJson(pathWithQuery: string) {
  const apiKey = process.env.SETLISTFM_API_KEY;
  if (!apiKey) throw new Error("Missing SETLISTFM_API_KEY");

  const res = await fetch(`${BASE_URL}${pathWithQuery}`, {
    headers: { "x-api-key": apiKey, Accept: "application/json" },
    cache: "no-store", // el cache lo manejamos con KV, no con Next
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
  freshSeconds: number; // si está dentro de fresh => devolver sin llamar upstream
  keepSeconds: number; // TTL total del KV (stale permitido)
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

  // Intento refrescar
  try {
    const value = await fetcher();
    const payload: Cached<T> = { fetchedAt: now, value };
    await kv.set(key, payload, { ex: keepSeconds });
    return { value, cache: cached ? "refreshed" : "miss" as const };
  } catch (e: unknown) {
    // Si falla, devuelvo stale si existe
    if (cached) {
      const msg = e instanceof Error ? e.message : String(e);
      return { value: cached.value, cache: "stale" as const, error: msg };
    }
    throw e;
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mbid = searchParams.get("mbid") || DEFAULT_MBID;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));

  // Cache policy:
  // p1: fresh 60s, keep 24h
  // p>1: fresh 24h, keep 30d
  const freshSeconds = page === 1 ? 60 : 24 * 60 * 60;
  const keepSeconds = page === 1 ? 24 * 60 * 60 : 30 * 24 * 60 * 60;

  const key = `setlist:tour:${mbid}:p${page}`;

  // Mock data if API key is missing
  if (!process.env.SETLISTFM_API_KEY) {
    console.warn("Missing SETLISTFM_API_KEY, returning mock data");
    const mockTour: TourCard[] = [
      {
        id: "mock-tour-1",
        eventDate: "04-02-2024",
        eventDateISO: "2024-02-04",
        tour: "The Eras Tour",
        venue: { id: "venue-1", name: "Tokyo Dome", url: "#" },
        city: { name: "Tokyo", state: null },
        country: { code: "JP", name: "Japan" },
        url: "#",
      },
      {
        id: "mock-tour-2",
        eventDate: "10-02-2024",
        eventDateISO: "2024-02-10",
        tour: "The Eras Tour",
        venue: { id: "venue-2", name: "Allegiant Stadium", url: "#" },
        city: { name: "Las Vegas", state: "NV" },
        country: { code: "US", name: "United States" },
        url: "#",
      }
    ];
    return NextResponse.json({
      page,
      itemsPerPage: 20,
      total: 2,
      cards: mockTour,
      meta: { mbid, page, cache: { mode: "mock" } }
    });
  }

  try {
    const result = await getWithKvFreshStale({
      key,
      freshSeconds,
      keepSeconds,
      fetcher: async () => {
        const upstream = await upstreamFetchJson(`/artist/${mbid}/setlists?p=${page}`);

        if (!upstream.ok) {
          // forzamos error para que el wrapper use stale si existe
          const err: ErrorWithStatus = new Error(
            upstream.status === 429 ? "Upstream rate limit (429)" : `Upstream error (${upstream.status})`
          );
          err.status = upstream.status;
          err.details = upstream.bodyText;
          throw err;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: any[] = Array.isArray(upstream.json?.setlist) ? upstream.json.setlist : [];
        const cards = raw.map(normalizeCard).filter(Boolean) as TourCard[];

        return {
          page,
          itemsPerPage: upstream.json?.itemsPerPage ?? 20,
          total: upstream.json?.total ?? null,
          cards,
        };
      },
    });

    return NextResponse.json({
      ...result.value,
      meta: {
        mbid,
        page,
        cache: {
          key,
          mode: result.cache,
          freshSeconds,
          keepSeconds,
        },
      },
    });
  } catch (e: unknown) {
    const status = (e as ErrorWithStatus).status || 500;
    const details = (e as ErrorWithStatus).details || (e instanceof Error ? e.message : String(e));
    return NextResponse.json({
      error: "Unexpected error",
      details,
      meta: { mbid, page, key },
    }, { status });
  }
}
