"use client";

import { Box, Button, Typography, useTheme } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { HistoryChapter, getText } from "@/types/historia";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEra } from "@/context/EraContext";

interface HistoryNavigationProps {
  currentChapter: HistoryChapter;
  previousChapter?: HistoryChapter;
  nextChapter?: HistoryChapter;
  allChapters: HistoryChapter[];
}

export default function HistoryNavigation({
  currentChapter,
  previousChapter,
  nextChapter,
  allChapters,
}: HistoryNavigationProps) {
  const theme = useTheme();
  const router = useRouter();
  const locale = useLocale() as "es" | "en";
  const t = useTranslations("history");
  const { setEra, currentEra } = useEra();

  const currentIndex = allChapters.findIndex(
    (ch) => ch.slug === currentChapter.slug,
  );
  const progress = ((currentIndex + 1) / allChapters.length) * 100;

  const handlePrevious = () => {
    if (previousChapter) {
      setEra(previousChapter.slug);
      router.push(`/era/${previousChapter.slug}`);
    }
  };

  const handleNext = () => {
    if (nextChapter) {
      setEra(nextChapter.slug);
      router.push(`/era/${nextChapter.slug}`);
    }
  };

  console.log(currentChapter.id, "currentChapter");

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
        p: 2,
        zIndex: 100,
      }}
    >
      {/* Barra de progreso */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            width: "100%",
            height: "4px",
            backgroundColor: theme.palette.grey[200],
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: currentEra.colors.primary,
              borderRadius: 2,
              transition: "width 0.5s ease",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mt: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: currentEra.colors.text,
            }}
          >
            {t("chapters")} {currentIndex + 1} de {allChapters.length}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: currentEra.colors.primary,
              fontWeight: 600,
            }}
          >
            {currentChapter.icon} {getText(currentChapter.title, locale)} (
            {currentChapter.period})
          </Typography>
        </Box>
      </Box>

      {/* Navegación */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Botón anterior */}
        {currentChapter.id === "debut" ? (
          <Box></Box>
        ) : (
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handlePrevious}
            disabled={!previousChapter}
            sx={{
              minWidth: "120px",
              borderColor: currentEra.colors.primary,
              color: currentEra.colors.text,
              "&:hover": {
                borderColor: currentEra.colors.primary,
                backgroundColor: `${currentEra.colors.primary}20`,
              },
              "&.Mui-disabled": {
                borderColor: theme.palette.grey[300],
                color: theme.palette.grey[400],
              },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              {previousChapter && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100px",
                  }}
                >
                  {getText(previousChapter.title, locale)}
                </Typography>
              )}
            </Box>
          </Button>
        )}

        {/* Botón siguiente */}

        {currentChapter.id === "midnights" ? (
          <Box></Box>
        ) : (
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={handleNext}
            disabled={!nextChapter}
            sx={{
              minWidth: "120px",
              borderColor: currentEra.colors.primary,
              color: currentEra.colors.text,
              "&:hover": {
                borderColor: currentEra.colors.primary,
                backgroundColor: `${currentEra.colors.primary}20`,
              },
              "&.Mui-disabled": {
                borderColor: theme.palette.grey[300],
                color: theme.palette.grey[400],
              },
            }}
          >
            <Box sx={{ textAlign: "right" }}>
              {nextChapter && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100px",
                  }}
                >
                  {getText(nextChapter.title, locale)}
                </Typography>
              )}
            </Box>
          </Button>
        )}
      </Box>
    </Box>
  );
}
