"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEra } from "@/context/EraContext";
import VideoCard from "./VideoCard";
import type { Video } from "@/types/video";

interface VideosGridProps {
  videos: Video[];
}

export default function VideosGrid({ videos }: VideosGridProps) {
  const { currentEra } = useEra();
  const t = useTranslations("videos");

  return (
    <Box component="main" role="main">
      {/* Title */}
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontSize: { xs: "2.5rem", md: "4rem" },
          fontWeight: "bold",
          textAlign: "center",
          mb: 2,
          color: currentEra.colors.heroText,
          textShadow: `2px 2px 4px ${currentEra.shadowColor}`,
          fontFamily: "Playfair Display, serif",
        }}
      >
        {t("title")}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          textAlign: "center",
          color: currentEra.colors.heroText,
          textShadow: `1px 1px 2px ${currentEra.shadowColor}`,
          mb: 6,
          maxWidth: "600px",
          mx: "auto",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {t("subtitle")}
      </Typography>

      {/* Videos Grid */}
      <Box
        component="section"
        aria-label="Colección de videos musicales de Taylor Swift"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {videos.map((video, index) => (
          <VideoCard
            video={video}
            key={`${video.title}-${video.year}-${index}`}
          />
        ))}
      </Box>
    </Box>
  );
}
