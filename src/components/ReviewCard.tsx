"use client";

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Review } from "@/types/review";
import { Link } from "@/i18n/navigation";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface ReviewCardProps {
  review: Review;
  locale: string;
}

export default function ReviewCard({ review, locale }: ReviewCardProps) {
  const localeKey = locale as "es" | "en";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "es" ? "es-AR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      album: { es: "Álbum", en: "Album" },
      concert: { es: "Concierto", en: "Concert" },
      documentary: { es: "Documental", en: "Documentary" },
      other: { es: "Otro", en: "Other" },
    };
    return labels[category as keyof typeof labels]?.[localeKey] || category;
  };

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/discography/reviews/${review.id}`}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <CardMedia
          component="img"
          height="200"
          image={review.imageUrl}
          alt={review.imageAlt[localeKey]}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Categoría y Rating */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Chip
              label={getCategoryLabel(review.category)}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 18, color: "warning.main" }} />
              <Typography variant="body2" fontWeight="bold">
                {review.rating}/10
              </Typography>
            </Box>
          </Box>

          {/* Título */}
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {review.title[localeKey]}
          </Typography>

          {/* Subtítulo */}
          {review.subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {review.subtitle[localeKey]}
            </Typography>
          )}

          {/* Fecha */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 2 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, opacity: 0.6 }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(review.publishedDate)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
