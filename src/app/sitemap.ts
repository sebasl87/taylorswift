import { MetadataRoute } from "next";
import discographyData from "@/constants/discography.json";
import liveAlbumsData from "@/constants/liveAlbums.json";
import compilationsData from "@/constants/compilations.json";
import epsData from "@/constants/eps.json";
import showsData from "@/constants/shows.json";
import interviewsData from "@/constants/interviews.json";
import bootlegsData from "@/constants/bootlegs.json";
import historiaData from "@/constants/historia.json";
import videosData from "@/constants/videos.json";
import { slugify } from "@/utils/slugify";
import { getAllSongs } from "@/utils/songs";
import { getAllNews } from "@/lib/supabase";
import type { HistoryData } from "@/types/historia";
import type { Show } from "@/types/show";
import { generateInterviewSlug } from "@/types/interview";
import { generateBootlegSlug, type Bootleg } from "@/types/bootleg";

const BASE_URL = "https://taylorswift.com.ar";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const sitemap: MetadataRoute.Sitemap = [];

  // Empuja las dos versiones (en + es) de una misma página, cada una
  // declarando a la otra como alternate — así Google indexa ambos idiomas
  // como URLs propias, no como duplicados. Los slugs dinámicos se arman con
  // la MISMA función que usa generateStaticParams de cada página.
  function pushBilingual(
    path: string,
    entry: {
      lastModified: Date;
      changeFrequency: ChangeFrequency;
      priority: number;
    },
  ) {
    const enUrl = `${BASE_URL}${path}`;
    const esUrl = path === "/" ? `${BASE_URL}/es` : `${BASE_URL}/es${path}`;
    const languages = { en: enUrl, es: esUrl };
    sitemap.push({ url: enUrl, alternates: { languages }, ...entry });
    sitemap.push({ url: esUrl, alternates: { languages }, ...entry });
  }

  // Páginas estáticas
  const staticPages: {
    path: string;
    changeFrequency: ChangeFrequency;
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/discography", changeFrequency: "monthly", priority: 0.9 },
    { path: "/songs", changeFrequency: "monthly", priority: 0.9 },
    { path: "/noticias", changeFrequency: "daily", priority: 0.9 },
    { path: "/videos", changeFrequency: "monthly", priority: 0.8 },
    { path: "/shows", changeFrequency: "weekly", priority: 0.8 },
    { path: "/tour", changeFrequency: "weekly", priority: 0.8 },
    { path: "/era", changeFrequency: "monthly", priority: 0.8 },
    { path: "/entrevistas", changeFrequency: "monthly", priority: 0.7 },
    { path: "/bootlegs", changeFrequency: "monthly", priority: 0.6 },
    { path: "/faq", changeFrequency: "yearly", priority: 0.5 },
    { path: "/contacto", changeFrequency: "yearly", priority: 0.4 },
    { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terminos", changeFrequency: "yearly", priority: 0.3 },
  ];
  for (const page of staticPages) {
    pushBilingual(page.path, {
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // Páginas de álbumes
  const allAlbums = [
    ...(discographyData as { id: string }[]),
    ...(liveAlbumsData as { id: string }[]),
    ...(compilationsData as { id: string }[]),
    ...(epsData as { id: string }[]),
  ];
  for (const album of allAlbums) {
    pushBilingual(`/discography/${album.id}`, {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Páginas de canciones (hay títulos repetidos entre ediciones, ej. TTPD y
  // The Anthology, que resuelven a la misma página)
  const songIds = new Set(getAllSongs().map((song) => song.id));
  for (const songId of songIds) {
    pushBilingual(`/songs/${songId}`, {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Páginas de shows
  for (const show of showsData as Show[]) {
    pushBilingual(`/shows/${show.id}`, {
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  // Páginas de entrevistas
  for (const interview of interviewsData as { id: string }[]) {
    pushBilingual(`/entrevistas/${generateInterviewSlug(interview.id)}`, {
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  // Páginas de bootlegs
  for (const bootleg of bootlegsData as Bootleg[]) {
    pushBilingual(`/bootlegs/${generateBootlegSlug(bootleg)}`, {
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  // Capítulos de historia / eras
  for (const chapter of (historiaData as HistoryData).chapters) {
    pushBilingual(`/era/${chapter.slug}`, {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Watch pages de videos (mismo slug que videos/[slug]/generateStaticParams)
  for (const video of videosData as { title: string }[]) {
    pushBilingual(`/videos/${slugify(video.title)}`, {
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  // Noticias desde Supabase: el id ya es la clave de búsqueda de la página
  // (getNewsById → .eq("id", id)), se usa tal cual, sin pasarlo por slugify
  try {
    const news = await getAllNews();
    for (const article of news) {
      pushBilingual(`/noticias/${article.id}`, {
        lastModified: new Date(article.publishedDate),
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  } catch {
    // Continuar sin noticias si Supabase no está disponible en build
  }

  return sitemap;
}
