import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import newsData from "@/constants/news.json";
import { NewsArticle } from "@/types/news";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Image from "next/image";
import Link from "next/link";
import { Typography, Box, Button, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Generate static params for all news
export async function generateStaticParams() {
  const articles = newsData as NewsArticle[];
  return articles.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params: { id, locale } }: { params: { id: string; locale: string } }) {
  const article = (newsData as NewsArticle[]).find((a) => a.id === id);
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
      images: article.imageUrl ? [`https://taylorswift.com${article.imageUrl}`] : [],
    },
  };
}

export default async function NoticiaPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const article = (newsData as NewsArticle[]).find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const title = article.title[locale as "es" | "en"];
  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
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
                alt={article.imageAlt?.[locale as "es" | "en"] || title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
          )}
          
          {/* Content rendering can be added here if needed, or if it is just title/image as per original file */}
        </Container>
      </Box>
    </ContainerGradientNoPadding>
  );
}
