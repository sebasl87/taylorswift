import * as mb from "@/providers/musicbrainz";
import * as jb from "@/providers/jambase";
import * as rss from "@/providers/rss";
import { ArtistData, TourEvent } from "@/types/artist-data";
import { getFromCache, setInCache } from "@/providers/utils";

const TRANSLATIONS = {
  es: {
    scheduled: "programado",
    cancelled: "cancelado",
    postponed: "pospuesto",
  },
  en: {
    scheduled: "scheduled",
    cancelled: "cancelled",
    postponed: "postponed",
  },
};

export async function getArtistData(artistName: string, lang: "es" | "en" = "en"): Promise<ArtistData> {
  const cacheKey = `artist:${artistName.toLowerCase()}:${lang}`;
  const cached = getFromCache<ArtistData>(cacheKey);

  if (cached) {
    return {
      ...cached,
      meta: {
        ...cached.meta,
        cache: { hit: true, ttl: 10 * 60 } // simplified ttl
      }
    };
  }

  const metaErrors: Record<string, string> = {};

  // 1. Resolve Artist IDs (Parallel)
  const [mbIdResult, jbIdResult] = await Promise.allSettled([
    mb.searchArtist(artistName),
    jb.searchArtist(artistName)
  ]);

  const mbId = mbIdResult.status === "fulfilled" ? mbIdResult.value : null;
  const jbId = jbIdResult.status === "fulfilled" ? jbIdResult.value : null;

  if (mbIdResult.status === "rejected") metaErrors.musicBrainzSearch = String(mbIdResult.reason);
  if (jbIdResult.status === "rejected") metaErrors.jamBaseSearch = String(jbIdResult.reason);

  // 2. Fetch Data (Parallel)
  const promises = [];

  // Discography (needs MB ID)
  let discographyPromise;
  if (mbId) {
    discographyPromise = mb.getDiscography(mbId);
  } else {
    discographyPromise = Promise.resolve([]);
  }
  promises.push(discographyPromise);

  // Tour (needs JB ID)
  let tourPromise;
  if (jbId) {
    tourPromise = jb.getTourDates(jbId);
  } else {
    tourPromise = Promise.resolve([]);
  }
  promises.push(tourPromise);

  // News (Independent)
  const newsPromise = rss.getNews();
  promises.push(newsPromise);

  const [discographyResult, tourResult, newsResult] = await Promise.allSettled(promises);

  // Process Results
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const discography = discographyResult.status === "fulfilled" ? (discographyResult.value as any[]) : [];
  let tour = tourResult.status === "fulfilled" ? (tourResult.value as TourEvent[]) : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const news = newsResult.status === "fulfilled" ? (newsResult.value as any[]) : [];

  if (discographyResult.status === "rejected") metaErrors.discography = String(discographyResult.reason);
  if (tourResult.status === "rejected") metaErrors.tour = String(tourResult.reason);
  if (newsResult.status === "rejected") metaErrors.news = String(newsResult.reason);

  // Translate Tour Status
  tour = tour.map(event => ({
    ...event,
    status: (TRANSLATIONS[lang] as Record<string, string>)[event.status.toLowerCase()] || event.status
  }));

  const response: ArtistData = {
    artist: {
      name: artistName, // ideally we'd use the canonical name from MB, but we keep it simple
      id: mbId || jbId || "unknown",
      sourceIds: {
        musicBrainz: mbId || undefined,
        jamBase: jbId || undefined,
      },
    },
    discography: {
      albums: discography,
    },
    tour: {
      events: tour,
    },
    news: {
      items: news,
    },
    meta: {
      fetchedAt: new Date().toISOString(),
      cache: {
        hit: false,
      },
    },
  };

  if (Object.keys(metaErrors).length > 0) {
    response.meta.errors = metaErrors;
  }

  // Cache successful result
  setInCache(cacheKey, response);

  return response;
}
