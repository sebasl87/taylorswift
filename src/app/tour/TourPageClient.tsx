"use client";
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
import { useTranslations, useLocale } from "next-intl";
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

export default function TourPageClient() {
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

  // Filtrar y ordenar conciertos
  const { upcoming, past } = useMemo(() => {
    const sorted = [...tourDates].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    const upcomingShows = sorted.filter((show) => {
      const showDate = new Date(show.date);
      return showDate >= today;
    });

    const pastShows = sorted.filter((show) => {
      const showDate = new Date(show.date);
      return showDate < today;
    });

    return {
      upcoming: filterConcerts(upcomingShows, searchQuery),
      past: filterConcerts(pastShows, searchQuery),
    };
  }, [today, sortOrder, searchQuery]);

  return (
    <ContainerGradientNoPadding>
      {/* Overlay con el color de la era */}
      <Box
        sx={{
          background: currentEra.colors.heroOverlay,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box pt="100px" px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("tour"), href: "/tour" }]} />
        </Box>

        <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
          {/* Header */}
          <Box mb={6} textAlign="center">
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
              The Eras Tour
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

          {/* Tabs */}
          <Box mb={3}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                bgcolor: "background.paper",
                borderRadius: 1,
                "& .MuiTab-root": { py: 2 },
              }}
            >
              <Tab label={t("upcoming")} />
              <Tab label={t("past")} />
            </Tabs>
          </Box>

          {/* Filtros */}
          <Box mb={4}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 10 }}>
                <TextField
                  fullWidth
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={toggleSortOrder}
                  startIcon={
                    sortOrder === "asc" ? (
                      <ArrowUpwardIcon />
                    ) : (
                      <ArrowDownwardIcon />
                    )
                  }
                  sx={{ height: 40 }}
                >
                  {t("date")}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Upcoming Shows Tab */}
          <TabPanel value={activeTab} index={0}>
            {upcoming.length > 0 ? (
              <Grid container spacing={3}>
                {upcoming.map((show, index) => (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 6, lg: 4 }}
                    key={`${show.date}-${index}`}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "translateY(-4px)" },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <Typography variant="h6" color="primary">
                            {new Date(show.date).toLocaleDateString(locale, {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </Typography>
                        </Box>
                        <Typography variant="h5" component="div" gutterBottom>
                          {show.city}, {show.country}
                        </Typography>
                        <Typography color="text.secondary" variant="body1">
                          {show.venue}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          variant="contained"
                          fullWidth
                          disabled={!show.ticketLink}
                        >
                          {t("tickets")}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary">
                  {t("noUpcoming")}
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Past Shows Tab */}
          <TabPanel value={activeTab} index={1}>
            <PastShowsGrid />
          </TabPanel>

          <Box sx={{ mt: 8, mb: 4 }}>
            <RandomSectionBanner currentSection="tour" />
          </Box>
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
