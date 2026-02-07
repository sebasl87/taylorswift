import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslations } from "next-intl";

// The original TourPage is "use client" and has hooks.
// I should probably move the logic to a component or just copy paste it into this file (renaming default export).
// Reusing from app_old might be risky if it has app router imports (it does not seem to have app router specific imports other than next-intl/server which is NOT used in the component itself, only in metadata which is separate).
// Wait, the component TourPage in app_old/tour/page.tsx imports from "next-intl" (useTranslations, useLocale) which is fine.
// It imports "next/navigation" ? No.
// It imports "next-intl/server" ? No, that was in generateMetadata.
// So I can potentially import it.
// BUT, I prefer to copy the content to `src/pages/tour/index.tsx` and adapt to ensure clean separation from app_old.
// Actually, I should create `src/components/TourPage.tsx` if I wanted to be clean, but putting it in `src/pages/tour/index.tsx` is fine for now.

// Let's copy the logic from src/app_old/tour/page.tsx but strip metadata export and use Head.
// I'll need to copy the imports and component code.

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Breadcrumb from "@/components/Breadcrumb";
import PastShowsGrid from "@/components/PastShowsGrid";
import { tourDates } from "@/constants/tourDates";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "@/components/NewsBanner";
import { useLocale } from "next-intl";
import { useEra } from "@/context/EraContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tour-tabpanel-${index}`}
      aria-labelledby={`tour-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TourPage() {
  const t = useTranslations("tour");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();
  const { currentEra } = useEra();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchQuery(""); // Limpiar búsqueda al cambiar de tab
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Obtener fecha actual
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Función para filtrar conciertos por búsqueda
  const filterConcerts = (concerts: typeof tourDates, query: string) => {
    if (!query.trim()) return concerts;

    const lowerQuery = query.toLowerCase();
    return concerts.filter(
      (show) =>
        show.city.toLowerCase().includes(lowerQuery) ||
        show.venue.toLowerCase().includes(lowerQuery) ||
        show.country.toLowerCase().includes(lowerQuery),
    );
  };

  // Función para ordenar conciertos
  const sortConcerts = (concerts: typeof tourDates, order: "asc" | "desc") => {
    return [...concerts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Filtrar y ordenar conciertos próximos
  const upcomingConcerts = useMemo(() => {
    const upcoming = tourDates.filter((show) => new Date(show.date) >= today);
    const filtered = filterConcerts(upcoming, searchQuery);
    return sortConcerts(filtered, sortOrder);
  }, [searchQuery, sortOrder, today]);

  // Filtrar y ordenar conciertos pasados
  // (Removed unused pastConcerts logic)

  // Metadata constants
  const titleByLocale = {
    es: "Taylor Swift Tour 2026 - Fechas y Entradas",
    en: "Taylor Swift Tour 2026 - Dates and Tickets",
  };

  const descriptionByLocale = {
    es: "Fechas oficiales del tour de Taylor Swift 2026. Encuentra entradas para The Eras Tour.",
    en: "Official Taylor Swift 2026 tour dates. Find tickets for The Eras Tour.",
  };

  const currentTitle =
    titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es;
  const currentDesc =
    descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
    descriptionByLocale.es;

  return (
    <>
      <Head>
        <title>{currentTitle}</title>
        <meta name="description" content={currentDesc} />
        <meta property="og:title" content={currentTitle} />
        <meta property="og:description" content={currentDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/taylor-tour.jpg" />
      </Head>

      <ContainerGradientNoPadding>
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: currentEra.colors.heroOverlay || "rgba(0,0,0,0.2)",
              pointerEvents: "none",
              transition: "background 0.5s ease",
              zIndex: 0,
            },
          }}
        >
          <Box ml={0} pt="100px">
            <Breadcrumb items={[{ label: tb("tour") }]} />
          </Box>
          <Box
            px={{ xs: 2, md: 4 }}
            pb={{ xs: 4, md: 6 }}
            maxWidth="1440px"
            mx="auto"
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box sx={{ mb: 6, textAlign: "center" }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  mb: 2,
                  color: currentEra.colors.heroText || "#FFFFFF",
                  textShadow: `2px 2px 8px ${currentEra.shadowColor}, 
                           0 0 20px ${currentEra.shadowColor}`,
                  transition: "color 0.5s ease, text-shadow 0.5s ease",
                }}
              >
                {t("title")}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: currentEra.colors.heroText || "#FFFFFF",
                  textShadow: `1px 1px 4px ${currentEra.shadowColor}`,
                  transition: "color 0.5s ease, text-shadow 0.5s ease",
                }}
              >
                {t("subtitle")}
              </Typography>

              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  centered
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab label={t("upcomingShows")} />
                  <Tab label={t("pastShows")} />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <TextField
                    placeholder={t("searchPlaceholder")}
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flexGrow: 1, maxWidth: 400 }}
                  />
                  <Button
                    startIcon={
                      sortOrder === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )
                    }
                    onClick={toggleSortOrder}
                    variant="outlined"
                  >
                    {t("date")}
                  </Button>
                </Box>
                {upcomingConcerts.length > 0 ? (
                  <Grid container spacing={3}>
                    {upcomingConcerts.map((show, index) => (
                      <Grid
                        size={{ xs: 12, sm: 6, md: 4 }}
                        key={`${show.date}-${show.city}-${index}`}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: 6,
                            },
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {show.city}, {show.country}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              {new Date(show.date).toLocaleDateString(locale, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                              {show.venue}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              color="primary"
                              href={show.ticketLink}
                              target="_blank"
                              fullWidth
                              variant="contained"
                            >
                              {t("tickets")}
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" sx={{ mt: 4 }}>
                    {t("noShowsFound")}
                  </Typography>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <PastShowsGrid />
              </TabPanel>
            </Box>
          </Box>
        </Box>
        <RandomSectionBanner currentSection="tour" />
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
