import videosData from "@/constants/videos.json";
import type { Video } from "@/types/video";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Box, Button, Chip, Container, Typography } from "@mui/material";
import { Link } from "@/i18n/navigation";
import { slugify } from "@/utils/slugify";
import { getYouTubeVideoId } from "@/types/show";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "@/components/NewsBanner";
import { i18nAlternates } from "@/utils/i18nAlternates";
import { absoluteUrl } from "@/utils/absoluteUrl";

// Watch page por video: Google solo indexa un video si está en una página
// cuyo contenido principal es ese video ("página de visualización"). La
// galería /videos linkea acá; cada página tiene metadata y VideoObject propios.

interface Props {
  params: Promise<{ slug: string }>;
}

function findVideoBySlug(slug: string): Video | undefined {
  return (videosData as Video[]).find((v) => slugify(v.title) === slug);
}

// Toma los N videos siguientes al actual en la lista (con wraparound), así
// cada watch page sugiere un set distinto y nunca se sugiere a sí misma.
function getRelatedVideos(
  videos: Video[],
  currentSlug: string,
  count = 3,
): Video[] {
  const currentIndex = videos.findIndex(
    (v) => slugify(v.title) === currentSlug,
  );
  if (currentIndex === -1) return videos.slice(0, count);

  const related: Video[] = [];
  for (let i = 1; i <= count; i++) {
    related.push(videos[(currentIndex + i) % videos.length]);
  }
  return related;
}

// Card liviana para "más videos": solo miniatura, título y año — sin
// descripción (a diferencia de VideoCard, que se usa en la galería completa).
function RelatedVideoCard({ video, lang }: { video: Video; lang: "es" | "en" }) {
  const videoId = getYouTubeVideoId(video.youtube);
  if (!videoId) return null;

  return (
    <Link
      href={`/videos/${slugify(video.title)}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          backgroundColor: "black",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={
            lang === "es"
              ? `Miniatura del video ${video.title} de Taylor Swift (${video.year})`
              : `Thumbnail of the ${video.title} video by Taylor Swift (${video.year})`
          }
          loading="lazy"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Typography
        variant="subtitle1"
        component="h3"
        sx={{ mt: 1.5, mb: 1, fontWeight: 700, color: "text.primary" }}
      >
        {video.title}
      </Typography>
      <Chip label={video.year} size="small" />
    </Link>
  );
}

export async function generateStaticParams() {
  return (videosData as Video[]).map((video) => ({
    slug: slugify(video.title),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const video = findVideoBySlug(slug);
  if (!video) return { title: "Video not found" };

  const lang = locale === "es" ? "es" : "en";
  const description = video.description[lang] || video.description.en;

  const title =
    lang === "es"
      ? `${video.title}: video oficial de Taylor Swift (${video.year})`
      : `${video.title}: Official Taylor Swift Music Video (${video.year})`;

  const videoId = getYouTubeVideoId(video.youtube);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/videos/${slug}`, locale),
      siteName: "Taylor Swift Fan Site",
      locale: lang === "es" ? "es_AR" : "en_US",
      type: "video.other",
      ...(thumbnail && {
        images: [{ url: thumbnail, width: 480, height: 360, alt: video.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(thumbnail && { images: [thumbnail] }),
    },
    alternates: i18nAlternates(`/videos/${slug}`, locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

function buildVideoJsonLd(
  video: Video,
  slug: string,
  videoId: string | null,
  lang: "es" | "en",
  locale: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description[lang] || video.description.en,
    // ISO 8601 completo con timezone — Google marca como inválida una fecha
    // cruda sin hora/timezone.
    uploadDate: new Date(`${video.year}-01-01`).toISOString(),
    ...(videoId && {
      thumbnailUrl: [`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`],
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    }),
    contentUrl: video.youtube,
    genre: "Pop",
    creator: { "@type": "MusicGroup", name: "Taylor Swift" },
    // Debe coincidir con el canonical de la página: en español lleva el
    // prefijo /es, si no Google recibe dos ubicaciones distintas del video.
    url: absoluteUrl(`/videos/${slug}`, locale),
  };
}

export default async function VideoWatchPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const video = findVideoBySlug(slug);
  if (!video) notFound();

  const t = await getTranslations({ locale, namespace: "videos" });
  const lang = locale === "es" ? "es" : "en";
  const videoId = getYouTubeVideoId(video.youtube);
  const relatedVideos = getRelatedVideos(videosData as Video[], slug);

  return (
    <ContainerGradientNoPadding>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildVideoJsonLd(video, slug, videoId, lang, locale),
          ),
        }}
      />
      <Box pt="100px" px={{ xs: 2, md: 0 }}>
        <Breadcrumb
          items={[
            { label: t("title"), href: "/videos" },
            { label: video.title },
          ]}
        />
      </Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 700, mb: 1 }}
        >
          {video.title}
        </Typography>
        <Chip label={video.year} size="small" color="primary" sx={{ mb: 3 }} />

        {videoId && (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
              backgroundColor: "black",
              mb: 3,
            }}
          >
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title={`${video.title} - Taylor Swift (${video.year})`}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </Box>
        )}

        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          {video.description[lang] || video.description.en}
        </Typography>

        <Box sx={{ mt: 4 }}>
          {/* Link como padre, no component={Link}: en un Server Component
              pasar Link como prop crashea en runtime (no lo detecta el build) */}
          <Link href="/videos" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: { xs: 16, md: 18 },
              fontWeight: 600,
            }}
          >
            {lang === "es" ? "Ver todos los videos" : "Back to all videos"}
          </Button>
          </Link>
        </Box>

        {/* Más videos sugeridos */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 700, mb: 3 }}
          >
            {lang === "es"
              ? "Más videos de Taylor Swift"
              : "More Taylor Swift videos"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {relatedVideos.map((relatedVideo) => (
              <RelatedVideoCard
                key={relatedVideo.title}
                video={relatedVideo}
                lang={lang}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 4, pb: 4 }}>
          <RandomSectionBanner currentSection="videos" />
        </Box>
      </Container>
    </ContainerGradientNoPadding>
  );
}
