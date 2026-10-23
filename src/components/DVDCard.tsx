"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { useLocale } from "next-intl";
import DVDImage from "./DVDImage";
import { Link } from "@/i18n/navigation";
import type { DVD } from "@/types/dvd";
import { getDVDShortDescription, generateDVDSlug } from "@/types/dvd";

// Interfaz extendida para manejar estructuras irregulares del JSON
interface DVDCardData extends Partial<DVD> {
  title?: string;
  album_title?: string;
  year?: number;
  release_year?: number;
  cover_image?: string;
}

interface DVDCardProps {
  dvd: DVDCardData;
}

export default function DVDCard({ dvd }: DVDCardProps) {
  const locale = useLocale();
  const shortDescription = getDVDShortDescription(dvd.description, locale);
  // Manejar tanto title como album_title del JSON
  const dvdTitle = dvd.title || dvd.album_title || "Unknown DVD";
  const dvdYear = dvd.year || dvd.release_year || 2000;
  const dvdSlug = generateDVDSlug(dvdTitle);

  // Usar cover_image si está disponible, sino generar URL usando el slug
  const imageUrl = dvd.cover_image || `${dvdSlug}.jpg`;

  const handleYouTubeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dvd.streaming?.youtube) {
      window.open(dvd.streaming.youtube, "_blank");
    }
  };

  return (
    <Card
      component={Link}
      href={`/dvds/${dvdSlug}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      {/* Portada del DVD */}
      <Box sx={{ position: "relative" }}>
        <DVDImage src={imageUrl} alt={`${dvdTitle} DVD cover`} />

        {/* Botón de YouTube overlay */}
        {dvd.streaming?.youtube && (
          <Tooltip
            title={locale === "es" ? "Ver en YouTube" : "Watch on YouTube"}
          >
            <IconButton
              onClick={handleYouTubeClick}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s ease",
              }}
              size="small"
            >
              <PlayArrow />
            </IconButton>
          </Tooltip>
        )}

        {/* Chip de formato */}
        <Chip
          label={dvd.format || "DVD"}
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            backgroundColor: "primary.main",
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Box>

      {/* Contenido de la card */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {dvdTitle}
        </Typography>

        {/* Información técnica */}
        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "background.default",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              color: "text.secondary",
              fontWeight: "medium",
            }}
          >
            {dvdYear}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "background.default",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              color: "text.secondary",
              fontWeight: "medium",
            }}
          >
            {dvd.label || "Unknown"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "background.default",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              color: "text.secondary",
              fontWeight: "medium",
            }}
          >
            {dvd.duration || "Unknown"}
          </Typography>
        </Box>

        {/* Descripción corta */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {shortDescription}
        </Typography>
      </CardContent>
    </Card>
  );
}
