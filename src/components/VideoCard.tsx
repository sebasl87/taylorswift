"use client";

import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { useState } from "react";
import { useLocale } from "next-intl";
import type { Video } from "@/types/video";

interface VideoCardProps {
  video: Video;
}

function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

function getVideoDescription(
  description: Video["description"],
  locale: string,
): string {
  return description[locale as keyof typeof description] || description.es;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const locale = useLocale();
  const videoId = getYouTubeVideoId(video.youtube);
  const description = getVideoDescription(video.description, locale);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (!videoId) {
    return null;
  }

  return (
    <Card
      component="article"
      itemScope
      itemType="https://schema.org/VideoObject"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      {/* Video Player */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          backgroundColor: "black",
        }}
      >
        {!isPlaying ? (
          <>
            {/* Thumbnail */}
            <Box
              component="img"
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={`Miniatura del video ${video.title} de Taylor Swift (${video.year})`}
              itemProp="thumbnailUrl"
              loading="lazy"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={handlePlay}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePlay();
                }
              }}
              tabIndex={0}
              role="button"
            />
            {/* Play Button Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              <IconButton
                onClick={handlePlay}
                aria-label={`Reproducir video ${video.title}`}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  width: 64,
                  height: 64,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <PlayArrow sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          </>
        ) : (
          /* YouTube Embed */
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={`Video: ${video.title} - Taylor Swift (${video.year})`}
            itemProp="embedUrl"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          itemProp="name"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            mb: 1,
          }}
        >
          {video.title}
        </Typography>

        <Typography
          variant="subtitle2"
          component="time"
          itemProp="uploadDate"
          dateTime={`${video.year}-01-01`}
          sx={{
            color: "text.secondary",
            mb: 1,
            fontWeight: "medium",
          }}
        >
          {video.year}
        </Typography>

        <Typography
          variant="body2"
          component="p"
          itemProp="description"
          sx={{
            color: "text.secondary",
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>

        {/* Metadatos ocultos para SEO */}
        <meta itemProp="contentUrl" content={video.youtube} />
        <meta itemProp="duration" content="PT3M30S" />
        <meta itemProp="genre" content="Pop" />
        <div
          itemProp="creator"
          itemScope
          itemType="https://schema.org/MusicGroup"
          style={{ display: "none" }}
        >
          <meta itemProp="name" content="Taylor Swift" />
        </div>
      </CardContent>
    </Card>
  );
}
