"use client";

import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Video } from "@/types/video";
import { slugify } from "@/utils/slugify";

interface VideoCardProps {
  video: Video;
}

function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

function getVideoDescription(
  description: Video["description"],
  locale: string
): string {
  return description[locale as keyof typeof description] || description.es;
}

export default function VideoCard({ video }: VideoCardProps) {
  const locale = useLocale();
  const videoId = getYouTubeVideoId(video.youtube);
  const description = getVideoDescription(video.description, locale);

  if (!videoId) {
    return null;
  }

  return (
    <Card
      component={Link}
      href={`/videos/${slugify(video.title)}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        textDecoration: "none",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          backgroundColor: "black",
        }}
      >
        <Box
          component="img"
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={
            locale === "es"
              ? `Miniatura del video ${video.title} de Taylor Swift (${video.year})`
              : `Thumbnail of the ${video.title} video by Taylor Swift (${video.year})`
          }
          loading="lazy"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
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
            aria-label={
              locale === "es" ? `Ver video ${video.title}` : `Watch ${video.title}`
            }
            component="div"
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
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
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
          component="span"
          sx={{
            color: "text.secondary",
            mb: 1,
            fontWeight: "medium",
            display: "block",
          }}
        >
          {video.year}
        </Typography>

        <Typography
          variant="body2"
          component="p"
          sx={{
            color: "text.secondary",
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
