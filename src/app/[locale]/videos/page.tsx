import { getTranslations, getLocale } from "next-intl/server";
import VideosPageClient from "./VideosPageClient";
import videosData from "@/constants/videos.json";
import type { Video } from "@/types/video";

// Datos estructurados para SEO (Server Side)
function generateStructuredData(locale: string) {
  const videoList = videosData.map((video: Video) => ({
    "@type": "VideoObject",
    name: video.title,
    description:
      video.description[locale as keyof typeof video.description] ||
      video.description.es,
    thumbnailUrl: `https://img.youtube.com/vi/${
      video.youtube.split("v=")[1]?.split("&")[0]
    }/hqdefault.jpg`,
    uploadDate: `${video.year}-01-01`,
    duration: "PT3M30S", // Duración promedio estimada
    contentUrl: video.youtube,
    embedUrl: `https://www.youtube.com/embed/${
      video.youtube.split("v=")[1]?.split("&")[0]
    }`,
    creator: {
      "@type": "MusicGroup",
      name: "Taylor Swift",
      genre: "Pop",
    },
  }));

  const titleByLocale = {
    es: "Videos Oficiales de Taylor Swift",
    en: "Official Taylor Swift Videos",
  };

  const descriptionByLocale = {
    es: "Colección completa de videos musicales oficiales de Taylor Swift",
    en: "Complete collection of official Taylor Swift music videos",
  };

  const aboutDescriptionByLocale = {
    es: "Cantante y compositora estadounidense, una de las artistas más influyentes de la música pop y country.",
    en: "American singer-songwriter, one of the most influential artists in pop and country music.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description:
      descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
      descriptionByLocale.es,
    url: "https://taylorswift.com.ar/videos",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: videosData.length,
      itemListElement: videoList.map((video, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: video,
      })),
    },
    about: {
      "@type": "MusicGroup",
      name: "Taylor Swift",
      genre: "Pop",
      foundingDate: "2006",
      description:
        aboutDescriptionByLocale[
          locale as keyof typeof aboutDescriptionByLocale
        ] || aboutDescriptionByLocale.es,
    },
  };
}

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "videos" });

  const titleByLocale = {
    es: "Videos Oficiales de Taylor Swift | Videoclips y Performances en Vivo",
    en: "Official Taylor Swift Videos | Music Videos and Live Performances",
  };

  const descriptionByLocale = {
    es: "Colección completa de videos musicales oficiales de Taylor Swift: desde su debut hasta sus últimos éxitos. Videoclips, performances en vivo y contenido exclusivo de la estrella del pop mundial.",
    en: "Complete collection of official Taylor Swift music videos: from her debut to her latest hits. Music videos, live performances and exclusive content from the global pop star.",
  };

  return {
    title:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description:
      descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
      descriptionByLocale.es,
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      type: "website",
    },
  };
}

export default async function VideosPage() {
  const locale = await getLocale();
  const structuredData = generateStructuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <VideosPageClient />
    </>
  );
}
