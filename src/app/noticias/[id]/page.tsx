import { Container, Typography, Box, Chip } from "@mui/material";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import newsData from "@/constants/news.json";
import { NewsArticle } from "@/types/news";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Image from "next/image";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import Link from "next/link";
import RandomSectionBanner from "@/components/NewsBanner";
import { CommentsSection } from "@/components/CommentsSection";

interface NewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return newsData.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }: NewsPageProps) {
  const resolvedParams = await params;
  const locale = (await getLocale()) as "es" | "en";
  const article = newsData.find((a) => a.id === resolvedParams.id) as
    | NewsArticle
    | undefined;

  if (!article) {
    return {
      title: "Noticia no encontrada",
    };
  }

  return {
    title: `${article.title[locale]} | Taylor Swift`,
    description: article.description[locale],
    openGraph: {
      title: article.title[locale],
      description: article.description[locale],
      type: "article",
      publishedTime: article.publishedDate,
      images: article.imageUrl
        ? [
            {
              url: `https://taylorswift.com${article.imageUrl}`,
              alt: article.imageAlt?.[locale] || article.title[locale],
            },
          ]
        : article.youtubeVideoId
          ? [
              {
                url: `https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg`,
                alt: article.title[locale],
              },
            ]
          : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title[locale],
      description: article.description[locale],
      images: article.imageUrl
        ? [`https://taylorswift.com${article.imageUrl}`]
        : article.youtubeVideoId
          ? [
              `https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg`,
            ]
          : [],
    },
  };
}

export default async function NoticiaPage({ params }: NewsPageProps) {
  const resolvedParams = await params;
  const locale = (await getLocale()) as "es" | "en";
  const tb = await getTranslations("breadcrumb");

  const article = newsData.find((a) => a.id === resolvedParams.id) as
    | NewsArticle
    | undefined;

  if (!article) {
    notFound();
  }

  // Formatear fecha
  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title[locale],
    description: article.description[locale],
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      "@type": "Organization",
      name: "Taylor Swift Fan Site",
      url: "https://taylorswift.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Taylor Swift Fan Site",
      url: "https://taylorswift.com",
      logo: {
        "@type": "ImageObject",
        url: "https://taylorswift.com/favicon.ico",
        width: 600,
        height: 60,
      },
    },
    image: article.imageUrl
      ? {
          "@type": "ImageObject",
          url: `https://taylorswift.com${article.imageUrl}`,
          ...(article.imageAlt && {
            caption: article.imageAlt[locale],
          }),
        }
      : article.youtubeVideoId
        ? {
            "@type": "ImageObject",
            url: `https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg`,
          }
        : {
            "@type": "ImageObject",
            url: "https://taylorswift.com/favicon.ico",
          },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://taylorswift.com${
        locale === "es" ? "" : `/${locale}`
      }/noticias/${article.id}`,
    },
    inLanguage: locale,
    about: {
      "@type": "MusicGroup",
      name: "Taylor Swift",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb
            items={[
              { label: tb("news"), href: `/noticias` },
              { label: article.title[locale] },
            ]}
          />
        </Box>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
          <article>
            {/* Fecha y tipo */}
            <Box sx={{ mb: 3 }}>
              <Chip
                label={formattedDate}
                sx={{ fontSize: "0.875rem", mr: 1 }}
              />
              {article.youtubeVideoId && (
                <Chip
                  label={locale === "es" ? "Video" : "Video"}
                  color="error"
                  sx={{ fontSize: "0.875rem" }}
                />
              )}
            </Box>

            {/* Título */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: 28, md: 48 },
                fontWeight: 600,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              {article.title[locale]}
            </Typography>

            {/* Descripción */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: 16, md: 18 },
                mb: 4,
                color: "text.secondary",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {article.description[locale]}
            </Typography>

            {/* Imagen o Video */}
            {article.youtubeVideoId && (
              <Box sx={{ mb: 4 }}>
                <YouTubeEmbed
                  videoId={article.youtubeVideoId}
                  title={article.title[locale]}
                />
              </Box>
            )}

            {article.imageUrl && !article.youtubeVideoId && (
              <Box sx={{ mb: 4, position: "relative", width: "100%" }}>
                <Image
                  src={article.imageUrl}
                  alt={article.imageAlt?.[locale] || article.title[locale]}
                  width={1200}
                  height={675}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 8,
                  }}
                />
                {article.imageCaption && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    {article.imageCaption[locale]}
                  </Typography>
                )}
              </Box>
            )}

            {/* Enlaces externos */}
            {article.externalLinks && article.externalLinks.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {locale === "es" ? "Enlaces relacionados" : "Related links"}
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {article.externalLinks.map((link, index) => (
                    <Box component="li" key={index} sx={{ mb: 1 }}>
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "inherit",
                          textDecoration: "underline",
                        }}
                      >
                        {link.text[locale]}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </article>
          <Box>
            <RandomSectionBanner currentSection="news" />
          </Box>
          {article.commentsActive && (
            <CommentsSection
              pageType="article"
              pageId={article.id}
              title={article.title[locale]}
            />
          )}
        </Container>
      </ContainerGradientNoPadding>
    </>
  );
}
