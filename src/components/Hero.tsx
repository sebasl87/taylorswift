"use client";

import { Box, Typography, Button, Chip, Stack, Container } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEra } from "@/context/EraContext";

export default function Hero() {
  const { currentEra } = useEra();
  const t = useTranslations("hero");

  // Función para scroll suave a una sección
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "600px", md: "80vh" },
        borderRadius: { xs: 0, md: 4 },
        overflow: "hidden",
        mb: 4,
      }}
    >
      {/* Imagen de fondo full-width */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/images/cards-home/hero.png"
          alt={t("imageAlt")}
          fill
          priority
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          sizes="100vw"
        />
      </Box>

      {/* Overlay oscuro para mejor contraste del texto */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 2,
        }}
      />

      {/* Contenido de texto sobre la imagen */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          alignItems: "center",
          minHeight: { xs: "600px", md: "80vh" },
          py: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "60%", lg: "50%" },
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
              fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
              lineHeight: 1.2,
              color: currentEra.colors.heroText,
              textShadow: `2px 2px 8px ${currentEra.shadowColor}, 0 0 20px rgba(0,0,0,0.5)`,
            }}
          >
            {t("title")}
          </Typography>

          {/* Bajada */}
          <Typography
            variant="h6"
            sx={{
              color: currentEra.colors.heroText,
              textShadow: `1px 1px 4px ${currentEra.shadowColor}`,
              fontSize: { xs: "1rem", md: "1.25rem" },
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
                borderColor: currentEra.colors.heroText,
                color: currentEra.colors.heroText,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                  backgroundColor: "rgba(255,255,255,0.06)",
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
              component="a"
              href="#eras"
              onClick={(e) => handleSmoothScroll(e, "eras")}
              clickable
              sx={{
                backgroundColor: "rgba(0,0,0,0.15)",
                backdropFilter: "blur(10px)",
                color: currentEra.colors.heroText,
                fontWeight: 500,
                border: `1px solid ${currentEra.colors.heroText}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  transform: "translateY(-2px)",
                },
              }}
            />
            <Chip
              label={t("chipTours")}
              component="a"
              href="#tour"
              onClick={(e) => handleSmoothScroll(e, "tour")}
              clickable
              sx={{
                backgroundColor: "rgba(0,0,0,0.15)",
                backdropFilter: "blur(10px)",
                color: currentEra.colors.heroText,
                fontWeight: 500,
                border: `1px solid ${currentEra.colors.heroText}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  transform: "translateY(-2px)",
                },
              }}
            />
            <Chip
              label={t("chipBio")}
              component={Link}
              href="/era"
              clickable
              sx={{
                backgroundColor: "rgba(0,0,0,0.15)",
                backdropFilter: "blur(10px)",
                color: currentEra.colors.heroText,
                fontWeight: 500,
                border: `1px solid ${currentEra.colors.heroText}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  transform: "translateY(-2px)",
                },
              }}
            />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
