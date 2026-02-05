import VideosGrid from "@/components/VideosGrid";
import videosData from "../../constants/videos.json";
import type { Video } from "@/types/video";
import { Container, Box } from "@mui/material";
import Head from "next/head";
import { useTranslations, useLocale } from "next-intl";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "@/components/NewsBanner";
import { CommentsSection } from "@/components/CommentsSection";
import { GetStaticProps } from "next";

// Datos estructurados para SEO
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

export default function VideosPage() {
  const locale = useLocale();
  const tb = useTranslations("breadcrumb");
  const v = useTranslations("videos");
  const structuredData = generateStructuredData(locale);

  const titleByLocale = {
    es: "Videos Oficiales de Taylor Swift | Videoclips y Performances en Vivo",
    en: "Official Taylor Swift Videos | Music Videos and Live Performances",
  };

  const descriptionByLocale = {
    es: "Colección completa de videos musicales oficiales de Taylor Swift: desde su debut hasta sus últimos éxitos. Videoclips, performances en vivo y contenido exclusivo de la estrella del pop mundial.",
    en: "Complete collection of official Taylor Swift music videos: from her debut to her latest hits. Music videos, live performances and exclusive content from the global pop star.",
  };

  const keywordsByLocale = {
    es: "Taylor Swift videos, videoclips Taylor Swift, The Eras Tour, Anti-Hero, Shake It Off, Love Story, Blank Space, Cruel Summer, música pop, videos oficiales, performances en vivo, All Too Well, Fortnight, Karma",
    en: "Taylor Swift videos, Taylor Swift music videos, The Eras Tour, Anti-Hero, Shake It Off, Love Story, Blank Space, Cruel Summer, pop music, official videos, live performances, All Too Well, Fortnight, Karma",
  };

  return (
    <>
      <Head>
        <title>
          {titleByLocale[locale as keyof typeof titleByLocale] ||
            titleByLocale.es}
        </title>
        <meta
          name="description"
          content={
            descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
            descriptionByLocale.es
          }
        />
        <meta
          name="keywords"
          content={
            keywordsByLocale[locale as keyof typeof keywordsByLocale] ||
            keywordsByLocale.es
          }
        />
        <link rel="canonical" href="https://taylorswift.com.ar/videos" />
        <meta
          property="og:title"
          content={
            titleByLocale[locale as keyof typeof titleByLocale] ||
            titleByLocale.es
          }
        />
        <meta
          property="og:description"
          content={
            descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
            descriptionByLocale.es
          }
        />
        <meta property="og:url" content="https://taylorswift.com.ar/videos" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-videos.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={
            titleByLocale[locale as keyof typeof titleByLocale] ||
            titleByLocale.es
          }
        />
        <meta
          name="twitter:description"
          content={
            descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
            descriptionByLocale.es
          }
        />
        <meta name="twitter:image" content="/og-videos.jpg" />
      </Head>

      {/* Datos estructurados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("videos") }]} />
        </Box>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
          <VideosGrid videos={videosData as unknown as Video[]} />
          <Box mt={4}>
            <RandomSectionBanner currentSection="videos" />
          </Box>
          <CommentsSection
            pageType="article"
            pageId="videos-page"
            customSubtitle={v("comment")}
          />
        </Container>
      </ContainerGradientNoPadding>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
};
