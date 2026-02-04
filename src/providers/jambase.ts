import { TourEvent } from "@/types/artist-data";
import { fetchWithRetry } from "./utils";

const BASE_URL = "https://www.jambase.com/jb-api/v1";

interface JBArtistSearchResponse {
  artists: {
    identifier: string;
    name: string;
  }[];
}

interface JBEvent {
  name: string;
  startDate: string;
  location: {
    name: string; // Venue
    address: {
      addressLocality: string; // City
      addressCountry: {
        name: string; // Country
      };
    };
  };
  url: string;
  eventStatus: string;
}

interface JBEventResponse {
  events: JBEvent[];
}

export async function searchArtist(name: string): Promise<string | null> {
  const apiKey = process.env.JAMBASE_API_KEY;
  if (!apiKey) {
    console.warn("JAMBASE_API_KEY is missing. Skipping JamBase.");
    return null;
  }

  const url = `${BASE_URL}/artists?artist_name=${encodeURIComponent(name)}&apikey=${apiKey}`;

  try {
    const data = await fetchWithRetry(url) as JBArtistSearchResponse;
    if (data.artists && data.artists.length > 0) {
      return data.artists[0].identifier;
    }
    return null;
  } catch (error) {
    console.error("JamBase search failed:", error);
    // Don't throw if just search fails, just return null so we can proceed with other providers
    return null; 
  }
}

export async function getTourDates(artistId: string): Promise<TourEvent[]> {
  const apiKey = process.env.JAMBASE_API_KEY;
  if (!apiKey) return [];

  const url = `${BASE_URL}/events?artist_id=${artistId}&apikey=${apiKey}`;

  try {
    const data = await fetchWithRetry(url) as JBEventResponse;
    
    if (!data.events) return [];

    return data.events.map((event) => ({
      name: event.name,
      date: event.startDate,
      venue: event.location?.name || "Unknown Venue",
      city: event.location?.address?.addressLocality || "Unknown City",
      country: event.location?.address?.addressCountry?.name || "Unknown Country",
      url: event.url,
      status: event.eventStatus || "scheduled",
    }));
  } catch (error) {
    console.error("JamBase events fetch failed:", error);
    throw error;
  }
}
