import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const BASE_URL = "https://api.setlist.fm/rest/1.0";

/** =======================
 * Helpers de fecha
 * ======================= */
function ddmmyyyyToISO(ddmmyyyy: string): string | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(ddmmyyyy);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

function isoToDate(iso: string): Date {
  // validación dura
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return new Date("invalid");
  return new Date(`${iso}T00:00:00.000Z`);
}

function addYearsISO(iso: string, deltaYears: number): string {
  const d = isoToDate(iso);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid ISO date for addYearsISO(): "${iso}"`);
  }
  const y = d.getUTCFullYear() + deltaYears;
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  const shifted = new Date(Date.UTC(y, m, day));
  if (Number.isNaN(shifted.getTime())) {
    throw new Error(`Invalid shifted date in addYearsISO() from "${iso}"`);
  }
  return shifted.toISOString().slice(0, 10);
}

/** =======================
 * Normalización
 * ======================= */
type NormalizedShow = {
  id: string;
  eventDate: string;
  eventDateISO: string;
  lastUpdated?: string | null;
  tour?: string | null;
  venue: { id: string; name: string; url?: string | null };
  city: {
    name: string;
    state?: string | null;
    countryCode?: string | null;
    countryName?: string | null;
    coords?: { lat: number; long: number } | null;
  };
  songs: Array<{ name: string; tape: boolean; info?: string | null; cover?: any | null }>;
  url?: string | null;
  attribution?: { text: string; url?: string | null };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSetlistItem(item: any): NormalizedShow | null {
  const iso = ddmmyyyyToISO(item?.eventDate);
  if (!item?.id || !iso) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setsRaw: any[] = Array.isArray(item?.sets?.set) ? item.sets.set : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const songsRaw: any[] = setsRaw.flatMap((setItem) =>
    Array.isArray(setItem?.song) ? setItem.song : []
  );
  const songs = songsRaw
    .map((s) => ({
      name: s?.name ?? "",
      tape: Boolean(s?.tape),
      info: s?.info ?? null,
      cover: s?.cover ?? null,
    }))
    .filter((s) => s.name);

  const venue = item?.venue ?? {};
  const city = venue?.city ?? {};
  const country = city?.country ?? {};

  return {
    id: item.id,
    eventDate: item.eventDate,
    eventDateISO: iso,
    lastUpdated: item.lastUpdated ?? null,
    tour: item?.tour?.name ?? null,
    venue: { id: venue?.id ?? "", name: venue?.name ?? "", url: venue?.url ?? null },
    city: {
      name: city?.name ?? "",
      state: city?.state ?? null,
      countryCode: country?.code ?? null,
      countryName: country?.name ?? null,
      coords: city?.coords ? { lat: Number(city.coords.lat), long: Number(city.coords.long) } : null,
    },
    songs,
    url: item?.url ?? null,
    attribution: item?.url ? { text: "Source: setlist.fm", url: item.url } : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickFirstWithSongs(rawList: any[]): NormalizedShow | null {
  const normalized = rawList
    .map(normalizeSetlistItem)
    .filter(Boolean) as NormalizedShow[];

  const withSongs = normalized.find((s) => Array.isArray(s.songs) && s.songs.length > 0);
  return withSongs ?? normalized[0] ?? null;
}

function pickClosestInSameMonth(shows: NormalizedShow[], targetISO: string): NormalizedShow | null {
  const target = isoToDate(targetISO);
  if (Number.isNaN(target.getTime())) return null;

  const ty = target.getUTCFullYear();
  const tm = target.getUTCMonth();

  const inMonth = shows.filter((s) => {
    const d = isoToDate(s.eventDateISO);
    return !Number.isNaN(d.getTime()) && d.getUTCFullYear() === ty && d.getUTCMonth() === tm;
  });

  if (!inMonth.length) return null;

  const tms = target.getTime();
  return inMonth
    .slice()
    .sort((a, b) => {
      const da = Math.abs(isoToDate(a.eventDateISO).getTime() - tms);
      const db = Math.abs(isoToDate(b.eventDateISO).getTime() - tms);
      return da - db;
    })[0];
}

function pickClosestInYear(shows: NormalizedShow[], targetISO: string): NormalizedShow | null {
  const target = isoToDate(targetISO);
  if (Number.isNaN(target.getTime())) return null;

  const ty = target.getUTCFullYear();
  const inYear = shows.filter((s) => {
    const d = isoToDate(s.eventDateISO);
    return !Number.isNaN(d.getTime()) && d.getUTCFullYear() === ty;
  });

  if (!inYear.length) return null;

  const tms = target.getTime();
  return inYear
    .slice()
    .sort((a, b) => {
      const da = Math.abs(isoToDate(a.eventDateISO).getTime() - tms);
      const db = Math.abs(isoToDate(b.eventDateISO).getTime() - tms);
      return da - db;
    })[0];
}

/** =======================
 * Upstream fetch
 * ======================= */
async function upstreamFetch(pathWithQuery: string) {
  const apiKey = process.env.SETLISTFM_API_KEY;
  if (!apiKey) throw new Error("Missing SETLISTFM_API_KEY");

  const res = await fetch(`${BASE_URL}${pathWithQuery}`, {
    headers: { "x-api-key": apiKey, Accept: "application/json" },
  });

  const bodyText = !res.ok ? await res.text().catch(() => "") : null;

  if (res.status === 429) return { ok: false as const, status: 429, bodyText };
  if (!res.ok) return { ok: false as const, status: res.status, bodyText };

  const json = await res.json();
  return { ok: true as const, status: res.status, json };
}

/** =======================
 * KV cache con "stale"
 * Guardamos { value, expiresAt } con TTL largo
 * ======================= */
type KVEntry<T> = { value: T; expiresAt: number };

async function kvGet<T>(key: string): Promise<{ value: T | null; stale: boolean }> {
  const entry = await kv.get<KVEntry<T>>(key);
  if (!entry) return { value: null, stale: false };
  const stale = Date.now() > entry.expiresAt;
  return { value: entry.value ?? null, stale };
}

async function kvSet<T>(key: string, value: T, freshForSeconds: number, keepSeconds: number) {
  const entry: KVEntry<T> = {
    value,
    expiresAt: Date.now() + freshForSeconds * 1000,
  };
  await kv.set(key, entry, { ex: keepSeconds });
}

/** =======================
 * Handler
 * ======================= */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mbid = searchParams.get("mbid") || "20244d07-534f-4eff-b4d4-930878889970";
  const yearsAgo = Number(searchParams.get("yearsAgo") || "5");
  // const warm = searchParams.get("warm") !== "0"; // Unused in logic but present in original
  const clear = searchParams.get("clear") === "1";

  const latestKey = `setlist:latest:${mbid}:p1`;
  const latestFreshSeconds = 60;     // 1 min fresco
  const latestKeepSeconds = 24 * 60 * 60; // lo guardo 24h para poder servir stale si hay 429

  const yearsKeepSeconds = 7 * 24 * 60 * 60; // guardo una semana
  const yearsFreshSeconds = 24 * 60 * 60;    // fresco 24h

  // Mock data if API key is missing
  if (!process.env.SETLISTFM_API_KEY) {
    console.warn("Missing SETLISTFM_API_KEY, returning mock data");
    const mockShow: NormalizedShow = {
      id: "mock-show-id",
      eventDate: "04-02-2024",
      eventDateISO: "2024-02-04",
      lastUpdated: new Date().toISOString(),
      tour: "The Eras Tour",
      venue: { id: "venue-id", name: "Tokyo Dome", url: "https://www.setlist.fm/venue/tokyo-dome-tokyo-japan-7bd61640.html" },
      city: {
        name: "Tokyo",
        state: null,
        countryCode: "JP",
        countryName: "Japan",
        coords: { lat: 35.7056, long: 139.7514 },
      },
      songs: [
        { name: "Miss Americana & the Heartbreak Prince", tape: false, info: "Shortened" },
        { name: "Cruel Summer", tape: false },
        { name: "The Man", tape: false },
        { name: "You Need to Calm Down", tape: false },
      ],
      url: "https://www.setlist.fm/setlist/taylor-swift/2024/tokyo-dome-tokyo-japan-33ad0045.html",
      attribution: { text: "Source: setlist.fm (MOCK)", url: "https://www.setlist.fm" },
    };
    return NextResponse.json({ latest: mockShow, yearsAgoPrev: mockShow });
  }

  try {
    /** 1) LATEST desde KV (o upstream) */
    let latestObj: NormalizedShow | null = null;
    const latestCached = await kvGet<NormalizedShow>(latestKey);

    if (clear) {
      await kv.del(latestKey);
    }

    if (latestCached.value && latestCached.value.songs?.length && !clear) {
      latestObj = latestCached.value;
    } else {
      const latestRes = await upstreamFetch(`/artist/${mbid}/setlists?p=1`);
      if (!latestRes.ok) {
        return NextResponse.json(
          { latest: null, yearsAgoPrev: null, error: "Upstream error", details: latestRes.bodyText },
          { status: latestRes.status }
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const latestRawList: any[] = Array.isArray(latestRes.json?.setlist) ? latestRes.json.setlist : [];
      latestObj = pickFirstWithSongs(latestRawList);
      if (!latestObj) {
        return NextResponse.json(
          { latest: null, yearsAgoPrev: null, error: "Latest not found/invalid" },
          { status: 404 }
        );
      }
      await kvSet(latestKey, latestObj, latestFreshSeconds, latestKeepSeconds);
    }

    // validación dura
    if (!latestObj?.eventDateISO || Number.isNaN(isoToDate(latestObj.eventDateISO).getTime())) {
      return NextResponse.json(
        { latest: latestObj ?? null, yearsAgoPrev: null, error: "Invalid latest.eventDateISO" },
        { status: 500 }
      );
    }

    /** 2) yearsAgoPrev key depende del target YYYY-MM */
    const targetISO = addYearsISO(latestObj.eventDateISO, -yearsAgo);
    const targetYear = targetISO.slice(0, 4);
    const targetMonth = targetISO.slice(5, 7);

    const yearsKey = `setlist:yearsAgo:${mbid}:${yearsAgo}:p1:${targetYear}-${targetMonth}`;

    // intento KV
    const yearsCached = await kvGet<NormalizedShow | null>(yearsKey);
    if (yearsCached.value !== null && !clear) {
      return NextResponse.json(
        {
          latest: latestObj,
          yearsAgoPrev: yearsCached.value,
          meta: {
            cachedYears: true,
            yearsStale: yearsCached.stale,
            targetISO,
          },
        }
      );
    }

    /** 3) Fetch upstream years ago */
    // Buscamos setlists de ese año. setlist.fm no deja filtrar por mes exacto fácilmente en /artist/{mbid}/setlists?year=YYYY
    // Tendremos que traer la página 1 del año targetYear y filtrar.
    const yearsRes = await upstreamFetch(`/artist/${mbid}/setlists?year=${targetYear}&p=1`);

    let found: NormalizedShow | null = null;
    if (yearsRes.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list: any[] = Array.isArray(yearsRes.json?.setlist) ? yearsRes.json.setlist : [];
      const normalizedList = list.map(normalizeSetlistItem).filter(Boolean) as NormalizedShow[];

      // Estrategia: "el show más cercano a targetISO dentro del mismo mes"
      // Si no hay nada en ese mes, "el más cercano en todo el año"
      found = pickClosestInSameMonth(normalizedList, targetISO);
      if (!found) {
        found = pickClosestInYear(normalizedList, targetISO);
      }
    }

    // Guardamos en cache (incluso si es null, para no martillar la API si no hubo show ese año)
    await kvSet(yearsKey, found, yearsFreshSeconds, yearsKeepSeconds);

    return NextResponse.json({
      latest: latestObj,
      yearsAgoPrev: found,
      meta: {
        cachedYears: false,
        targetISO,
        apiStatus: yearsRes.status,
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
