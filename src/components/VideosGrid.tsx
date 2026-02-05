"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import VideoCard from "./VideoCard";
import type { Video } from "@/types/video";

interface VideosGridProps {
  videos: Video[];
}

export default function VideosGrid({ videos }: VideosGridProps) {
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
          background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
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
          color: "text.secondary",
          mb: 6,
          maxWidth: "600px",
          mx: "auto",
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
