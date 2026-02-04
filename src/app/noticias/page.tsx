"use client";

import { Container, Typography, Box, Tabs, Tab, Grid } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import newsData from "@/constants/news.json";
import { NewsArticle } from "@/types/news";
import Breadcrumb from "@/components/Breadcrumb";
import { useState, useMemo } from "react";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import NewsCard from "@/components/NewsCard";
import RandomSectionBanner from "@/components/NewsBanner";

export default function NoticiasPage() {
  const t = useTranslations("news");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale() as "es" | "en";

  // Ordenar noticias por fecha más reciente primero
  const sortedNews = useMemo(
    () =>
      ([...newsData] as NewsArticle[]).sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime()
      ),
    []
  );

  // Agrupar noticias por mes/año
  const groupedByMonth = useMemo(() => {
    const groups = new Map<string, NewsArticle[]>();
    sortedNews.forEach((article) => {
      const date = new Date(article.publishedDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(article);
    });
    return Array.from(groups.entries()).map(([key, articles]) => ({
      key,
      articles,
    }));
  }, [sortedNews]);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Formatear nombre del mes
  const getMonthLabel = (key: string) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("description"),
    url: `https://taylorswift.com/${locale}/noticias`,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "Taylor Swift Fan Club",
      logo: {
        "@type": "ImageObject",
        url: "https://taylorswift.com/logo.png",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sortedNews.slice(0, 10).map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "NewsArticle",
          headline: article.title[locale],
          description: article.description[locale].substring(0, 200),
          datePublished: article.publishedDate,
          url: `https://taylorswift.com/${locale}/noticias/${article.id}`,
          image: article.imageUrl
            ? `https://taylorswift.com${article.imageUrl}`
            : article.youtubeVideoId
            ? `https://img.youtube.com/vi/${article.youtubeVideoId}/hqdefault.jpg`
            : "https://taylorswift.com/logo.png",
        },
      })),
    },
  };

  const currentMonthArticles = groupedByMonth[selectedTab]?.articles || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("news") }]} />
        </Box>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 32, md: 56 }, mb: 2, fontWeight: 700 }}
          >
            {t("title")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: 16, md: 18 },
              mb: 4,
              color: "text.secondary",
            }}
          >
            {t("description")}
          </Typography>

          {/* Tabs de meses */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {groupedByMonth.map((group) => (
                <Tab
                  key={group.key}
                  label={`${getMonthLabel(group.key)} (${
                    group.articles.length
                  })`}
                />
              ))}
            </Tabs>
          </Box>

          {/* Grid de noticias del mes seleccionado */}
          <Grid container spacing={3}>
            {currentMonthArticles.map((article) => (
              <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <NewsCard article={article} />
              </Grid>
            ))}
          </Grid>

          {currentMonthArticles.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: "center", py: 8 }}>
              {locale === "es"
                ? "No hay noticias para este mes"
                : "No news for this month"}
            </Typography>
          )}
          <Box mt={4}>
            <RandomSectionBanner currentSection="news" />
          </Box>
        </Container>
      </ContainerGradientNoPadding>
    </>
  );
}
