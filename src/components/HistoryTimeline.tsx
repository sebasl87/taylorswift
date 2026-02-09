"use client";

import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
} from "@mui/material";
import { HistoryChapter, getText } from "@/types/historia";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "next-intl";

interface HistoryTimelineProps {
  chapters: HistoryChapter[];
  currentChapter?: string;
}

export default function HistoryTimeline({
  chapters,
  currentChapter,
}: HistoryTimelineProps) {
  const theme = useTheme();
  const router = useRouter();
  const locale = useLocale() as "es" | "en";
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const handleChapterClick = (chapterSlug: string) => {
    router.push(`/historia/${chapterSlug}`);
  };

  const getChapterColor = (chapter: HistoryChapter, index: number) => {
    if (chapter.color) return chapter.color;
    // Fallback colors for Taylor Swift Eras
    const colors = [
      "#B6D06D", // Taylor Swift
      "#EBC06D", // Fearless
      "#A47E99", // Speak Now
      "#7D3C4C", // Red
      "#8FB4D7", // 1989
      "#000000", // Reputation
      "#D37398", // Lover
      "#72787F", // Folklore
      "#C49C6C", // Evermore
      "#242E47", // Midnights
    ];
    return colors[index % colors.length];
  };

  if (isMobile) {
    // Versión Mobile (Vertical)
    return (
      <Box sx={{ position: "relative", px: 2, py: 4 }}>
        {/* Línea vertical */}
        <Box
          sx={{
            position: "absolute",
            left: "28px",
            top: 0,
            bottom: 0,
            width: "2px",
            background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            zIndex: 0,
          }}
        />

        {chapters.map((chapter, index) => {
          const color = getChapterColor(chapter, index);
          const isHovered = hoveredChapter === chapter.slug;

          return (
            <Box
              key={chapter.id}
              sx={{
                display: "flex",
                mb: 4,
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => handleChapterClick(chapter.slug)}
              onMouseEnter={() => setHoveredChapter(chapter.slug)}
              onMouseLeave={() => setHoveredChapter(null)}
            >
              {/* Punto en la línea */}
              <Box
                sx={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: `2px solid ${theme.palette.background.paper}`,
                  boxShadow: `0 0 10px ${color}`,
                  position: "absolute",
                  left: "21px",
                  top: "20px",
                  zIndex: 1,
                  transition: "transform 0.3s ease",
                  transform: isHovered ? "scale(1.5)" : "scale(1)",
                }}
              />

              {/* Tarjeta */}
              <Box
                sx={{
                  ml: 8,
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(color, 0.3)}`,
                  boxShadow: isHovered
                    ? `0 4px 20px ${alpha(color, 0.2)}`
                    : "none",
                  transition: "all 0.3s ease",
                  width: "100%",
                  "&:hover": {
                    transform: "translateX(5px)",
                    border: `1px solid ${color}`,
                  },
                }}
              >
                <Chip
                  label={`${chapter.yearStart}${
                    chapter.yearEnd !== chapter.yearStart
                      ? `-${chapter.yearEnd}`
                      : ""
                  }`}
                  size="small"
                  sx={{
                    backgroundColor: alpha(color, 0.2),
                    color: color,
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                    height: "20px",
                    mb: 1,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1.2,
                    mb: 0.5,
                    color: theme.palette.text.primary,
                  }}
                >
                  {getText(chapter.title, locale)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.85rem" }}
                >
                  {getText(chapter.summary, locale)}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  // Versión Desktop (Horizontal ZigZag)
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        py: 8,
        mt: 4,
        overflowX: "visible",
      }}
    >
      {/* Línea horizontal central */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)", // Gradiente azul a violeta
          transform: "translateY(-50%)",
          zIndex: 0,
          borderRadius: 2,
          boxShadow: "0 0 10px rgba(25, 118, 210, 0.5)",
        }}
      />

      {/* Años inicio/fin en la línea */}
      <Typography
        sx={{
          position: "absolute",
          top: "50%",
          left: "-60px",
          transform: "translateY(-50%)",
          fontWeight: "bold",
          color: "text.secondary",
          fontSize: "1.2rem",
        }}
      >
        {chapters[0]?.yearStart}
      </Typography>
      <Typography
        sx={{
          position: "absolute",
          top: "50%",
          right: "-60px",
          transform: "translateY(-50%)",
          fontWeight: "bold",
          color: "text.secondary",
          fontSize: "1.2rem",
        }}
      >
        {chapters[chapters.length - 1]?.yearEnd}
      </Typography>

      {/* Contenedor de items distribuido uniformemente */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
          px: 2,
        }}
      >
        {chapters.map((chapter, index) => {
          const color = getChapterColor(chapter, index);
          const isTop = index % 2 === 0; // Pares arriba
          const isHovered = hoveredChapter === chapter.slug;

          return (
            <Box
              key={chapter.id}
              sx={{
                position: "relative",
                width: "100%", // Distribuir espacio equitativamente
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "450px", // Altura total del área de timeline aumentada
                pointerEvents: "none", // Permitir click through en áreas vacías
              }}
            >
              {/* Punto central */}
              <Box
                sx={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: isHovered
                    ? color
                    : theme.palette.background.paper,
                  border: `3px solid ${color}`,
                  boxShadow: `0 0 ${isHovered ? "20px" : "10px"} ${color}`,
                  cursor: "pointer",
                  pointerEvents: "auto",
                  transition:
                    "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform: isHovered ? "scale(1.5)" : "scale(1)",
                  zIndex: 2,
                }}
                onClick={() => handleChapterClick(chapter.slug)}
                onMouseEnter={() => setHoveredChapter(chapter.slug)}
                onMouseLeave={() => setHoveredChapter(null)}
              />

              {/* Tarjeta */}
              <Box
                sx={{
                  position: "absolute",
                  top: isTop ? "20px" : "auto",
                  bottom: isTop ? "auto" : "20px",
                  width: "240px",
                  pointerEvents: "auto",
                  cursor: "pointer",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform: isHovered
                    ? `translateY(${isTop ? "-10px" : "10px"}) scale(1.05)`
                    : "translateY(0) scale(1)",
                  zIndex: 3,
                }}
                onClick={() => handleChapterClick(chapter.slug)}
                onMouseEnter={() => setHoveredChapter(chapter.slug)}
                onMouseLeave={() => setHoveredChapter(null)}
              >
                {/* Línea conectora */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    [isTop ? "bottom" : "top"]: "-55px", // Distancia hasta el punto
                    height: "55px",
                    width: "2px",
                    background: `linear-gradient(${
                      isTop ? "0deg" : "180deg"
                    }, ${color} 0%, transparent 100%)`,
                    transform: "translateX(-50%)",
                    opacity: 0.6,
                  }}
                />

                <Box
                  sx={{
                    backgroundColor: alpha("#1A1A1A", 0.9), // Fondo oscuro estilo Megadeth
                    border: `1px solid ${alpha(color, 0.5)}`,
                    borderRadius: "12px",
                    p: 2,
                    boxShadow: isHovered
                      ? `0 10px 30px ${alpha(color, 0.3)}`
                      : `0 4px 10px rgba(0,0,0,0.3)`,
                    textAlign: "left",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Decoración de fondo */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "60px",
                      height: "60px",
                      background: `radial-gradient(circle at top right, ${alpha(
                        color,
                        0.2
                      )} 0%, transparent 70%)`,
                      borderRadius: "0 12px 0 100%",
                    }}
                  />

                  <Chip
                    label={`${chapter.yearStart}${
                      chapter.yearEnd !== chapter.yearStart
                        ? `-${chapter.yearEnd}`
                        : ""
                    }`}
                    size="small"
                    sx={{
                      backgroundColor: alpha(color, 0.2),
                      color: color,
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                      height: "20px",
                      mb: 1,
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      lineHeight: 1.2,
                      mb: 0.5,
                    }}
                  >
                    {getText(chapter.title, locale)}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                      mb: 1,
                    }}
                  >
                    {getText(chapter.subtitle || { es: "", en: "" }, locale)}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.7rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {getText(chapter.summary, locale)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
