import { Album } from "@/types/artist-data";
import { fetchWithRetry } from "./utils";

const BASE_URL = "https://musicbrainz.org/ws/2";
const USER_AGENT = "TaylorSwiftApp/1.0.0 ( contact@example.com )";

interface MBArtistSearchResponse {
  artists: {
    id: string;
    name: string;
    score: number;
  }[];
}

interface MBReleaseGroup {
  id: string;
  title: string;
  "first-release-date": string;
  "primary-type": string;
}

interface MBReleaseGroupResponse {
  "release-groups": MBReleaseGroup[];
}

export async function searchArtist(name: string): Promise<string | null> {
  const query = encodeURIComponent(name);
  const url = `${BASE_URL}/artist?query=${query}&fmt=json`;

  try {
    const data = await fetchWithRetry(url, {
      headers: { "User-Agent": USER_AGENT },
    }) as MBArtistSearchResponse;

    if (data.artists && data.artists.length > 0) {
      // Return the ID of the best match (usually the first one)
      return data.artists[0].id;
    }
    return null;
  } catch (error) {
    console.error("MusicBrainz search failed:", error);
    throw error;
  }
}

export async function getDiscography(artistId: string): Promise<Album[]> {
  // Fetch albums and singles, but let's prioritize albums for brevity
  const url = `${BASE_URL}/release-group?artist=${artistId}&type=album&fmt=json&limit=100`;

  try {
    const data = await fetchWithRetry(url, {
      headers: { "User-Agent": USER_AGENT },
    }) as MBReleaseGroupResponse;

    if (!data["release-groups"]) return [];

    return data["release-groups"].map((rg) => ({
      title: rg.title,
      date: rg["first-release-date"],
      type: rg["primary-type"] || "Album",
      tracks: [], // Tracks would require additional calls per album, skipping for performance/quota
    })).sort((a, b) => {
      // Sort by date desc
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("MusicBrainz discography fetch failed:", error);
    throw error;
  }
}
