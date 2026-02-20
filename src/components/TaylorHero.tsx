"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import EraSelector from "./EraSelector";
import Hero from "./Hero";
import { useEra } from "@/context/EraContext";
import LastShowsCards from "./LastShowsCards";
import TopSongsWidget from "./TopSongsWidget";
import UpcomingToursWidget from "./UpcomingToursWidget";
import NewsPreview from "@/components/NewsPreview";

export default function TaylorHero() {
  const { currentEra } = useEra();

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
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            {"Noticias"}
          </Typography>

          <NewsPreview />
        </Box>

        
      </Container>
    </Box>
  );
}
