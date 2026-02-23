import { MetadataRoute } from "next";
import discographyData from "@/constants/discography.json";
import liveAlbumsData from "@/constants/liveAlbums.json";
import compilationsData from "@/constants/compilations.json";
import epsData from "@/constants/eps.json";
import showsData from "@/constants/shows.json";
import interviewsData from "@/constants/interviews.json";
import bootlegsData from "@/constants/bootlegs.json";
import historiaData from "@/constants/historia.json";
import { getAllSongs } from "@/utils/songs";
import { getAllNews } from "@/lib/supabase";
import type { HistoryData } from "@/types/historia";
import type { Show } from "@/types/show";

const BASE_URL = "https://taylorswift.com.ar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/discography`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/songs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/noticias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/videos`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shows`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tour`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/era`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/entrevistas`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/bootlegs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terminos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Páginas de álbumes
  const allAlbums = [
    ...(discographyData as { id: string }[]),
    ...(liveAlbumsData as { id: string }[]),
    ...(compilationsData as { id: string }[]),
    ...(epsData as { id: string }[]),
  ];
  const albumPages: MetadataRoute.Sitemap = allAlbums.map((album) => ({
    url: `${BASE_URL}/discography/${album.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Páginas de canciones
  const songs = getAllSongs();
  const songPages: MetadataRoute.Sitemap = songs.map((song) => ({
    url: `${BASE_URL}/songs/${song.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Páginas de shows
  const shows = showsData as Show[];
  const showPages: MetadataRoute.Sitemap = shows.map((show) => ({
    url: `${BASE_URL}/shows/${show.id}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // Páginas de entrevistas
  const interviews = interviewsData as { id: string }[];
  const interviewPages: MetadataRoute.Sitemap = interviews.map((interview) => ({
    url: `${BASE_URL}/entrevistas/${interview.id}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // Páginas de bootlegs
  const bootlegs = bootlegsData as { id: string }[];
  const bootlegPages: MetadataRoute.Sitemap = bootlegs.map((bootleg) => ({
    url: `${BASE_URL}/bootlegs/${bootleg.id}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  // Capítulos de historia / eras
  const historia = historiaData as HistoryData;
  const historiaPages: MetadataRoute.Sitemap = historia.chapters.map(
    (chapter) => ({
      url: `${BASE_URL}/era/${chapter.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  // Noticias desde Supabase
  let newsPages: MetadataRoute.Sitemap = [];
  try {
    const news = await getAllNews();
    newsPages = news.map((article) => ({
      url: `${BASE_URL}/noticias/${article.id}`,
      lastModified: new Date(article.publishedDate),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));
  } catch {
    // Continuar sin noticias si Supabase no está disponible en build
  }

  return [
    ...staticPages,
    ...albumPages,
    ...songPages,
    ...showPages,
    ...interviewPages,
    ...bootlegPages,
    ...historiaPages,
    ...newsPages,
  ];
}