export interface Album {
  title: string;
  date: string;
  type: string;
  tracks: string[];
}

export interface TourEvent {
  name: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  url: string;
  status: string;
}

export interface NewsItem {
  title: string;
  date: string;
  source: string;
  url: string;
  summary: string;
}

export interface ArtistData {
  artist: {
    name: string;
    id: string;
    sourceIds: {
      musicBrainz?: string;
      jamBase?: string;
    };
  };
  discography: {
    albums: Album[];
  };
  tour: {
    events: TourEvent[];
  };
  news: {
    items: NewsItem[];
  };
  meta: {
    fetchedAt: string;
    cache: {
      hit: boolean;
      ttl?: number;
    };
    errors?: Record<string, string>;
  };
}
