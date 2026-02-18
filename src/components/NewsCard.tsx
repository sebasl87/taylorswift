"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { NewsArticle } from "@/types/news";
import Link from "next/link";
import { useLocale } from "next-intl";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const locale = useLocale() as "es" | "en";

  // Formatear fecha
  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const hasYouTube = !!article.youtubeVideoId;
  const hasImage = !!article.imageUrl;

  // Determinar imagen a mostrar (siempre muestra algo)
  const imageToShow =
    article.imageUrl ||
    (hasYouTube
      ? `https://img.youtube.com/vi/${article.youtubeVideoId}/hqdefault.jpg`
      : null) ||
    "/images/news/default-taylor-swift.jpg";

  return (
    <Card
      component={Link}
      href={`/noticias/${article.id}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={imageToShow}
        alt={article.imageAlt?.[locale] || article.title[locale]}
        sx={{ objectFit: "cover" }}
      />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ mb: 1 }}>
          <Chip
            label={formattedDate}
            size="small"
            sx={{ fontSize: "0.75rem" }}
          />
          {hasYouTube && (
            <Chip
              label="Video"
              size="small"
              color="error"
              sx={{ ml: 1, fontSize: "0.75rem" }}
            />
          )}
        </Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {article.title[locale]}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
            minHeight: "4.5em", // 3 líneas * 1.5 line-height
          }}
        >
          {article.description[locale]}
        </Typography>
      </CardContent>
    </Card>
  );
}
