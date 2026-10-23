"use client";

import { Box, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HistoryTimeline from "@/components/HistoryTimeline";
import historiaData from "@/constants/historia.json";
import { HistoryData } from "@/types/historia";
import { History, AutoStories } from "@mui/icons-material";
import { useTranslations, useLocale } from "next-intl";
import Breadcrumb from "@/components/Breadcrumb";
import { useEra } from "@/context/EraContext";

export default function HistoriaClient() {
  const data = historiaData as HistoryData;
  const t = useTranslations("history");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale() as "es" | "en";
  const theme = useTheme();
  const { currentEra } = useEra();

  // Función helper para obtener texto en el idioma actual
  const getText = (bilingualText: { es: string; en: string }) => {
    return bilingualText[locale];
  };

  // Estadísticas interesantes
  const stats = [
    { label: t("activeYears"), value: "18+", detail: "2006-Present" },
    { label: t("studioAlbums"), value: "11", detail: t("includingFinal") },
    { label: t("lineupChanges"), value: "10", detail: t("multipleEras") },
    { label: t("worldwideSales"), value: "200M+", detail: t("recordsSold") },
  ];

  return (
    <>
      {/* Overlay con el color de la era */}
      <Box
        sx={{
          background: currentEra.colors.heroOverlay,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box pt="100px" px={{ xs: 2, md: 0 }} pb={{ xs: 2, md: 4 }}>
          <Breadcrumb items={[{ label: tb("history") }]} />
        </Box>
        <Box
          display={"flex"}
          alignItems="center"
          width={"100%"}
          flexDirection={"column"}
        >
          <Box sx={{ maxWidth: "1392px", padding: 0 }} width={"100%"}>
            {/* Hero Section */}
            <Box
              sx={{
                textAlign: "center",
                mb: 8,
                backgroundImage: `url(/images/site-updates/history.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                color:
                  currentEra.colors.heroText ||
                  theme.palette.getContrastText(currentEra.colors.primary),
                borderRadius: { xs: 0, md: 4 },
                p: { xs: 2, md: 6 },
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gradient overlay muy sutil para mantener el theme de la era */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: currentEra.gradient,
                  opacity: 0.15,
                  zIndex: 0,
                }}
              />
              {/* Overlay oscuro para mejor contraste del texto */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.4)"
                      : "rgba(0,0,0,0.3)",
                  zIndex: 1,
                }}
              />
              <Box sx={{ position: "relative", zIndex: 2 }}>
                {/* Título principal */}
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.5rem", md: "4rem" },
                    mb: 2,
                    color: "#FFFFFF",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {getText(data.title)}
                </Typography>

                {/* Subtítulo */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "1.2rem", md: "1.8rem" },
                    mb: 4,
                    color: "#FFFFFF",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    opacity: 0.9,
                  }}
                >
                  {getText(data.subtitle)}
                </Typography>

                {/* Introducción */}
                <Typography
                  variant="h6"
                  sx={{
                    maxWidth: "900px",
                    mx: "auto",
                    mb: 4,
                    lineHeight: 1.6,
                    color: "#FFFFFF",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                  }}
                >
                  {getText(data.introduction)}
                </Typography>

                {/* Estadísticas */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, 1fr)",
                      md: "repeat(4, 1fr)",
                    },
                    gap: 3,
                    mt: 4,
                    maxWidth: "800px",
                    mx: "auto",
                  }}
                >
                  {stats.map((stat, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        p: 2,
                        border:
                          theme.palette.mode === "dark"
                            ? "1px solid rgba(255,255,255,0.2)"
                            : "1px solid rgba(0,0,0,0.2)",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 900,
                          color: "#FFFFFF",
                          fontSize: { xs: "1.5rem", md: "2rem" },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 0.5, color: "#FFFFFF" }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.8, color: "#FFFFFF" }}
                      >
                        {stat.detail}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Sección de Timeline */}
            <Box sx={{ mb: 8 }}>
              <Box sx={{ textAlign: "center", mb: 0 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "2rem", md: "3rem" },
                    color: currentEra.colors.heroText,
                    textShadow: `2px 2px 4px ${currentEra.shadowColor}`,
                  }}
                >
                  {t("interactiveTimeline")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: currentEra.colors.heroText,
                    textShadow: `1px 1px 2px ${currentEra.shadowColor}`,
                    maxWidth: "700px",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  {t("timelineDescription")}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    icon={<AutoStories />}
                    label={t("epicChapters")}
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderColor: currentEra.colors.heroText,
                      color: currentEra.colors.heroText,
                    }}
                  />
                  <Chip
                    icon={<History />}
                    label={t("yearsOfHistory")}
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderColor: currentEra.colors.heroText,
                      color: currentEra.colors.heroText,
                    }}
                  />
                  <Chip
                    label={t("multimediaContent")}
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderColor: currentEra.colors.heroText,
                      color: currentEra.colors.heroText,
                    }}
                  />
                </Box>
              </Box>

              <HistoryTimeline chapters={data.chapters} />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
