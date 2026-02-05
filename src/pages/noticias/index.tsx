import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslations, useLocale } from "next-intl";
import newsData from "@/constants/news.json";
import { NewsArticle } from "@/types/news";
import Breadcrumb from "@/components/Breadcrumb";
import { useState, useMemo } from "react";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import NewsCard from "@/components/NewsCard";
import RandomSectionBanner from "@/components/NewsBanner";
import { Typography, Box, Tabs, Tab, Grid } from "@mui/material";

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
          new Date(a.publishedDate).getTime(),
      ),
    [],
  );

  // Agrupar noticias por mes/año
  const groupedByMonth = useMemo(() => {
    const groups = new Map<string, NewsArticle[]>();
    sortedNews.forEach((article) => {
      const date = new Date(article.publishedDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
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

  // Head content
  const pageTitle = t("pageTitle");
  const pageDescription = t("pageDescription");

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        {/* Add more meta tags as needed */}
      </Head>

      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("news") }]} />
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              align="center"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: "linear-gradient(45deg, #FF69B4 30%, #FF1493 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("title")}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              {t("description")}
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab label={t("allNews")} />
                {groupedByMonth.map((group) => (
                  <Tab key={group.key} label={getMonthLabel(group.key)} />
                ))}
              </Tabs>
            </Box>

            <Grid container spacing={3}>
              {selectedTab === 0
                ? sortedNews.map((article) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                      <NewsCard article={article} />
                    </Grid>
                  ))
                : groupedByMonth[selectedTab - 1]?.articles.map((article) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                      <NewsCard article={article} />
                    </Grid>
                  ))}
            </Grid>
          </Box>
        </Box>
        <RandomSectionBanner currentSection="news" />
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
