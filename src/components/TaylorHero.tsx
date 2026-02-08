"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import EraSelector from "./EraSelector";
import Hero from "./Hero";
import { useEra } from "@/context/EraContext";
import LastShowsCards from "./LastShowsCards";
import TopSongsWidget from "./TopSongsWidget";
import UpcomingToursWidget from "./UpcomingToursWidget";

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

        <EraSelector />
        <Box sx={{ mt: 4 }}>
          <LastShowsCards />
        </Box>

        {/* Widgets de Top Songs y Upcoming Tours */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TopSongsWidget />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <UpcomingToursWidget />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
