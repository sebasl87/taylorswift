"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { tourDates } from "@/constants/tourDates";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface UpcomingToursWidgetProps {
  limit?: number;
}

export default function UpcomingToursWidget({
  limit = 8,
}: UpcomingToursWidgetProps) {
  const t = useTranslations("upcomingTours");
  const locale = useLocale() as "es" | "en";

  // Filtrar solo fechas futuras y ordenar
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingShows = tourDates
    .filter((show) => new Date(show.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);

  if (upcomingShows.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        {/* Imagen de encabezado con título superpuesto */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 180, md: 220 },
          }}
        >
          <Image
            src="/images/cards-home/tourcalendar4.jpg"
            alt={t("title")}
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Título superpuesto */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 3 },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: 24, md: 32 },
                fontWeight: 600,
                color: "white",
                textAlign: "left",
              }}
            >
              {t("title")}
            </Typography>
          </Box>
        </Box>

        <CardContent
          sx={{
            p: { xs: 2, md: 3 },
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Lista de shows */}
          {upcomingShows.map((show, index) => (
            <Box key={`${show.date}-${show.city}`}>
              {index > 0 && <Divider sx={{ my: 2 }} />}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  py: 1,
                }}
              >
                {/* Fecha */}
                <Box
                  sx={{
                    minWidth: { xs: "100%", sm: 140 },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 16, md: 18 },
                      color: "primary.main",
                    }}
                  >
                    {formatDate(show.date)}
                  </Typography>
                </Box>

                {/* Ubicación */}
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <LocationOnIcon
                      sx={{ fontSize: 20, color: "text.secondary" }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: 16, md: 18 } }}
                    >
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {show.city}
                      </Box>
                      , {show.country}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pl: 3.5, fontSize: { xs: 13, md: 14 } }}
                  >
                    {show.venue}
                  </Typography>
                </Box>

                {/* Badge próximo show */}
                {index === 0 && (
                  <Chip
                    label={t("nextShow")}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
            </Box>
          ))}

          {/* Link para ver todas las fechas */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: "auto",
              pt: 3,
            }}
          >
            <Typography
              component={Link}
              href="/tour"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: { xs: 14, md: 16 },
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("viewAll")} →
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
