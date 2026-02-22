import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import newsData from "@/constants/news.json";
import { NewsArticle } from "@/types/news";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Link from "next/link";
import NoticiasEraStyler from "@/components/NoticiasEraStyler";
import { Typography, Box, Container, Chip } from "@mui/material";
import { getNewsById } from "@/lib/supabase";
import SafeNewsImage from "@/components/SafeNewsImage";
import { getSafeTranslation } from "@/utils/safeContent";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import RandomSectionBanner from "@/components/NewsBanner";
import { CommentsSection } from "@/components/CommentsSection";
import Breadcrumb from "@/components/Breadcrumb";

// Generate static params for all news
export async function generateStaticParams() {
  const articles = newsData as NewsArticle[];
  return articles.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = (await getLocale()) as "es" | "en";

  const article = await getNewsById(id);

  if (!article) return {};

  const title = article.title[locale as "es" | "en"];
  const description = article.description[locale as "es" | "en"];

  return {
    title: `${title} | Taylor Swift`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "article",
      publishedTime: article.publishedDate,
      images: article.imageUrl
        ? [`https://taylorswift.com${article.imageUrl}`]
        : [],
    },
  };
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const locale = (await getLocale()) as "es" | "en";

  const article = await getNewsById(id);

  if (!article) {
    notFound();
  }

  // breadcrumb translations will be handled inside the client header component

  const title = getSafeTranslation(
    article.title,
    locale,
    locale === "es" ? "Noticia sin título" : "Untitled news",
  );

  const description = getSafeTranslation(
    article.description,
    locale,
    locale === "es" ? "Descripción no disponible" : "Description unavailable",
  );

  const imageAlt = getSafeTranslation(article.imageAlt, locale, title);

  // Formatear fecha
  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <>
      <ContainerGradientNoPadding>
        {/* Aplicar theme de era vía componente cliente que usa useEra. */}
        <div id="noticia-root">
          <NoticiasEraStyler />
          <Box pt="100px" pb="34px">
            <Breadcrumb
              items={[
                {
                  label: locale === "es" ? "Noticias" : "News",
                  href: "/noticias",
                },
                { label: title },
              ]}
            />
          </Box>
          <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
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
                {title}
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
                {description}
              </Typography>

              {/* Imagen o Video */}
              {article.youtubeVideoId && (
                <Box sx={{ mb: 4 }}>
                  <YouTubeEmbed
                    videoId={article.youtubeVideoId}
                    title={title}
                  />
                </Box>
              )}

              {article.imageUrl && !article.youtubeVideoId && (
                <Box
                  sx={{
                    mb: 4,
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <SafeNewsImage
                    src={article.imageUrl}
                    alt={imageAlt}
                    width={800}
                    height={400}
                    style={{
                      width: "52%",
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
        </div>
      </ContainerGradientNoPadding>
    </>
  );
}
