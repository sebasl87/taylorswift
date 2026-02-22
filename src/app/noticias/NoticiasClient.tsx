"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState, useMemo } from "react";
import { NewsArticle } from "@/types/news";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import NewsCard from "@/components/NewsCard";
import RandomSectionBanner from "@/components/NewsBanner";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import LoaderSnake from "@/components/LoaderSnake";
import { useEra } from "@/context/EraContext";

export default function NoticiasClient() {
  const t = useTranslations("news");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale() as "es" | "en";

  const { currentEra } = useEra();

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/noticias/api/news");
        if (!res.ok) throw new Error("Error al obtener noticias");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  // Ordenar noticias por fecha más reciente primero
  const sortedNews = useMemo(
    () =>
      ([...news] as NewsArticle[]).sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime(),
      ),
    [news],
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

  if (loading) {
    return (
      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }}>
          <LoaderSnake size={96} caption={t("loading")} />
        </Box>
      </ContainerGradientNoPadding>
    );
  }

  if (error) {
    return (
      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }}>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Box>
      </ContainerGradientNoPadding>
    );
  }

  return (
    <ContainerGradientNoPadding>
      <Box
        sx={{
          background: currentEra.colors.heroOverlay,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box pt="100px" px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("news") }]} />
        </Box>

        <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: currentEra.colors.heroText,
                textShadow: `2px 2px 4px ${currentEra.shadowColor}`,
                fontFamily: "Playfair Display, serif",
              }}
            >
              {t("title")}
            </Typography>
            <Typography
              variant="h5"
              paragraph
              sx={{
                color: currentEra.colors.heroText,
                textShadow: `1px 1px 2px ${currentEra.shadowColor}`,
                fontFamily: "Montserrat, sans-serif",
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
                bgcolor: "background.paper",
                borderRadius: 1,
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "1rem",
                },
              }}
            >
              {groupedByMonth.map((group) => (
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
                      lg: "1fr 1fr 1fr 1fr",
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
      </Box>
    </ContainerGradientNoPadding>
  );
}
