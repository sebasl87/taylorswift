import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import { useTranslations, useLocale } from "next-intl";
import newsData from "@/constants/news.json";
import { NewsArticle } from "@/types/news";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Image from "next/image";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import Link from "next/link";
import RandomSectionBanner from "@/components/NewsBanner";
import { CommentsSection } from "@/components/CommentsSection";
import { Container, Typography, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface NoticiaPageProps {
  article: NewsArticle;
}

export default function NoticiaPage({ article }: NoticiaPageProps) {
  const tb = useTranslations("breadcrumb");
  const locale = useLocale() as "es" | "en";

  const title = article.title[locale];
  const description = article.description[locale];
  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <>
      <Head>
        <title>{`${title} | Taylor Swift`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:published_time" content={article.publishedDate} />
        {article.imageUrl && (
          <meta
            property="og:image"
            content={`https://taylorswift.com${article.imageUrl}`}
          />
        )}
        {/* Add JSON-LD here if needed using a script tag */}
      </Head>

      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb
            items={[{ label: tb("news"), href: "/noticias" }, { label: title }]}
          />

          <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box mb={4}>
              <Button
                component={Link}
                href="/noticias"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 2 }}
              >
                {tb("backToNews") || "Back to News"}
              </Button>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 800 }}
              >
                {title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                {formattedDate}
              </Typography>
            </Box>

            {article.imageUrl && (
              <Box
                position="relative"
                width="100%"
                height={{ xs: 300, md: 500 }}
                mb={4}
                borderRadius={2}
                overflow="hidden"
              >
                <Image
                  src={article.imageUrl}
                  alt={article.imageAlt?.[locale] || title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>
            )}

            {article.youtubeVideoId && (
              <Box mb={4}>
                <YouTubeEmbed videoId={article.youtubeVideoId} title={title} />
              </Box>
            )}

            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
              }}
            >
              {description}
            </Typography>

            <Box mt={8}>
              <CommentsSection
                pageId={article.id}
                pageType="news"
                title={title}
              />
            </Box>
          </Container>
        </Box>
        <RandomSectionBanner currentSection="news" />
      </ContainerGradientNoPadding>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = newsData as unknown as NewsArticle[];
  const locales = ["en", "es"];
  const paths: { params: { id: string }; locale: string }[] = [];

  articles.forEach((article) => {
    locales.forEach((locale) => {
      paths.push({ params: { id: article.id }, locale });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const id = params?.id as string;
  const articles = newsData as unknown as NewsArticle[];
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
};
