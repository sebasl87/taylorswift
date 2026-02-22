"use client";

import { Box, Container, Typography, Grid, Button } from "@mui/material";
import EraSelector from "./EraSelector";
import Hero from "./Hero";
import { useEra } from "@/context/EraContext";
import LastShowsCards from "./LastShowsCards";
import TopSongsWidget from "./TopSongsWidget";
import UpcomingToursWidget from "./UpcomingToursWidget";
import NewsPreview from "@/components/NewsPreview";
import { useTranslations } from "next-intl";
import Link from "next/link";
import RandomSectionBanner from "./NewsBanner";
import siteUpdatesData from "@/constants/site-updates.json";
import SiteUpdatesBanner from "./SiteUpdatesBanner";

export default function TaylorHero() {
  const { currentEra } = useEra();
  const t = useTranslations("news");

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "transparent",
        background: currentEra.gradient,
        transition: "background 0.5s ease",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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
          zIndex: 0, // Detrás del contenido
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
          paddingTop: "100px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Hero />

        <div id="eras">
          <EraSelector />
        </div>
        <Box sx={{ mt: 4 }} id="shows">
          <LastShowsCards />
        </Box>

        {/* Banner de actualizaciones del sitio */}
        {siteUpdatesData.length > 0 && (
          <Box sx={{ width: "100%", mb: 4 }}>
            <SiteUpdatesBanner updates={siteUpdatesData} />
          </Box>
        )}

        {/* Widgets de Top Songs y Upcoming Tours */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TopSongsWidget />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} id="tour">
              <UpcomingToursWidget />
            </Grid>
          </Grid>
        </Box>

        {/* Últimas 8 noticias */}
        <Box sx={{ mt: 6 }} id="news-preview">
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: 22, md: 48 },
              color: currentEra.colors.heroText,
            }}
          >
            {t("title")}
          </Typography>

          <NewsPreview />
          <Box
            display="flex"
            justifyContent="center"
            mt={4}
            mb={8}
            width="100%"
          >
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/noticias"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                borderWidth: 2,
                borderColor: currentEra.colors.heroText,
                color: currentEra.colors.heroText,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(10px)",
                },
              }}
            >
              {t("ctaSecondary")}
            </Button>
          </Box>
          <Box sx={{ mt: 8, mb: 4 }}>
            <RandomSectionBanner currentSection="news" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
