"use client";

import { useTranslations, useLocale } from "next-intl";
import newsData from "@/constants/news.json";
import { NewsArticle } from "@/types/news";
import Breadcrumb from "@/components/Breadcrumb";
import { useState, useMemo } from "react";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import NewsCard from "@/components/NewsCard";
import RandomSectionBanner from "@/components/NewsBanner";
import { Typography, Box, Tabs, Tab, Grid } from "@mui/material";

export default function NoticiasClient() {
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

  return (
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
            sx={{
              color: "text.secondary",
              maxWidth: "800px",
              mx: "auto",
              mb: 4,
            }}
          >
            {t("subtitle")}
          </Typography>
        </Box>

        {/* Tabs por Mes */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="news timeline tabs"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                fontSize: "1rem",
              },
            }}
          >
            {groupedByMonth.map((group, index) => (
              <Tab key={group.key} label={getMonthLabel(group.key)} />
            ))}
          </Tabs>
        </Box>

        {/* Lista de Noticias */}
        {groupedByMonth.map((group, index) => (
          <div
            key={group.key}
            role="tabpanel"
            hidden={selectedTab !== index}
            id={`news-tabpanel-${index}`}
            aria-labelledby={`news-tab-${index}`}
          >
            {selectedTab === index && (
              <Box sx={{ py: 3 }}>
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  }}
                  gap={4}
                >
                  {group.articles.map((article) => (
                    <Box key={article.id}>
                      <NewsCard article={article} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </div>
        ))}

        <Box sx={{ mt: 8, mb: 4 }}>
          <RandomSectionBanner currentSection="news" />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
