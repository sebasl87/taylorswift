"use client";

import { Box, Typography, Button, Grid, Chip, Stack } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEra } from "@/context/EraContext";

export default function Hero() {
  const { currentEra } = useEra();
  const t = useTranslations("hero");


  return (
    <Grid
      container
      spacing={4}
      sx={{
        alignItems: "center",
        minHeight: { xs: "auto", md: "60vh" },
      }}
    >
      {/* Columna Izquierda - Texto */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* H1 - SEO optimizado */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
              lineHeight: 1.2,
              color: currentEra.colors.heroText || "#FFFFFF",
              textShadow: `2px 2px 8px ${currentEra.shadowColor}, 
                           0 0 20px ${currentEra.shadowColor}`,
              transition: "color 0.5s ease, text-shadow 0.5s ease",
            }}
          >
            {t("title")}
          </Typography>

          {/* Bajada */}
          <Typography
            variant="h6"
            sx={{
              color: currentEra.colors.heroText || "#FFFFFF",
              textShadow: `1px 1px 4px ${currentEra.shadowColor}`,
              transition: "color 0.5s ease, text-shadow 0.5s ease",
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            {t("subtitle")}
          </Typography>

          {/* CTAs Principales */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/discography"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: `0 4px 14px ${currentEra.shadowColor}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 20px ${currentEra.shadowColor}`,
                },
              }}
            >
              {t("ctaPrimary")}
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/noticias"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                borderWidth: 2,
                borderColor: currentEra.colors.heroText || "#FFFFFF",
                color: currentEra.colors.heroText || "#FFFFFF",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                },
              }}
            >
              {t("ctaSecondary")}
            </Button>
          </Box>

          {/* Mini-links / Chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={t("chipEras")}
              component={Link}
              href="/eras"
              clickable
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                color: currentEra.colors.heroText || "#FFFFFF",
                fontWeight: 500,
                border: `1px solid rgba(255, 255, 255, 0.3)`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                },
              }}
            />
            <Chip
              label={t("chipTours")}
              component={Link}
              href="/shows"
              clickable
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                color: currentEra.colors.heroText || "#FFFFFF",
                fontWeight: 500,
                border: `1px solid rgba(255, 255, 255, 0.3)`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                },
              }}
            />
            <Chip
              label={t("chipBio")}
              component={Link}
              href="/biografia"
              clickable
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                color: currentEra.colors.heroText || "#FFFFFF",
                fontWeight: 500,
                border: `1px solid rgba(255, 255, 255, 0.3)`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                },
              }}
            />
          </Stack>
        </Box>
      </Grid>

      {/* Columna Derecha - Imagen */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "400px", sm: "500px", md: "600px" },
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: `0 20px 60px ${currentEra.shadowColor}`,
            transition: "box-shadow 0.5s ease",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${currentEra.colors.primary}15, ${currentEra.colors.secondary}15)`,
              pointerEvents: "none",
              transition: "background 0.5s ease",
            },
          }}
        >
          <Image
            src="/images/site-updates/hero.jpg"
            alt={t("imageAlt")}
            fill
            priority
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </Box>
      </Grid>
    </Grid>
  );
}
