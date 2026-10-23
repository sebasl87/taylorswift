"use client";

import { Box, Typography, Button, IconButton } from "@mui/material";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Image from "next/image";

interface SiteUpdate {
  id: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  imageUrl: string;
  linkUrl?: string;
  linkText: { es: string; en: string };
  publishedDate: string;
  updatedDate: string;
  active: boolean;
}

interface SiteUpdatesBannerProps {
  updates: SiteUpdate[];
}

export default function SiteUpdatesBanner({ updates }: SiteUpdatesBannerProps) {
  const locale = useLocale() as "es" | "en";
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeUpdates = updates.filter((update) => update.active);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (isPaused || activeUpdates.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeUpdates.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, activeUpdates.length]);

  if (activeUpdates.length === 0) return null;

  const currentUpdate = activeUpdates[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + activeUpdates.length) % activeUpdates.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeUpdates.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleClick = () => {
    if (currentUpdate.linkUrl) {
      router.push(currentUpdate.linkUrl);
    }
  };

  return (
    <Box
      sx={{
        mb: 6,
        position: "relative",
        width: "100%",
        height: { xs: 560, sm: 206 },
      }}
    >
      {/* Navigation Buttons - Fuera de la card */}
      {activeUpdates.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: { xs: -16, sm: -24 },
              top: { xs: 280, sm: 103 },
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(255, 255, 255, 0.9)",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(220, 20, 60, 0.8)"
                  : "none",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(220, 20, 60, 0.9)"
                    : "rgba(220, 20, 60, 0.9)",
                color: "white",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(220, 20, 60, 1)"
                    : "none",
              },
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: -16, sm: -24 },
              top: { xs: 280, sm: 103 },
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(255, 255, 255, 0.9)",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(220, 20, 60, 0.8)"
                  : "none",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(220, 20, 60, 0.9)"
                    : "rgba(220, 20, 60, 0.9)",
                color: "white",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(220, 20, 60, 1)"
                    : "none",
              },
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </>
      )}

      <Box
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        sx={{
          position: "relative",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(139, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.3) 100%)"
              : "linear-gradient(135deg, rgba(220, 20, 60, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)",
          border: (theme) =>
            `2px solid ${
              theme.palette.mode === "dark"
                ? "rgba(220, 20, 60, 0.5)"
                : "rgba(220, 20, 60, 0.3)"
            }`,
          borderRadius: 2,
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 3,
          flexDirection: { xs: "column", sm: "row" },
          transition: "all 0.3s ease",
          width: "100%",
          height: { xs: 560, sm: 206 },
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 8px 24px rgba(220, 20, 60, 0.4)"
                : "0 8px 24px rgba(220, 20, 60, 0.3)",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(220, 20, 60, 0.7)"
                : "rgba(220, 20, 60, 0.5)",
          },
        }}
      >
        {/* Image */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", sm: 160 },
            height: { xs: 200, sm: 160 },
            flexShrink: 0,
            borderRadius: 2,
            overflow: "hidden",
            border: (theme) =>
              `2px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(220, 20, 60, 0.6)"
                  : "rgba(220, 20, 60, 0.4)"
              }`,
          }}
        >
          <Image
            src={currentUpdate.imageUrl}
            alt={currentUpdate.title[locale]}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: 18, sm: 20 },
              color: (theme) =>
                theme.palette.mode === "dark" ? "#ff4444" : "#dc143c",
            }}
          >
            {currentUpdate.title[locale]}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: 14, sm: 15 },
              mb: 1,
            }}
          >
            {currentUpdate.description[locale]}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              fontSize: 12,
            }}
          >
            {locale === "es" ? "Actualizado: " : "Updated: "}
            {new Date(
              currentUpdate.updatedDate + "T00:00:00"
            ).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>

        {/* CTA Button */}
        {currentUpdate.linkUrl && (
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #8b0000 0%, #dc143c 100%)"
                  : "linear-gradient(135deg, #dc143c 0%, #ff4444 100%)",
              color: "white",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: 14, sm: 15 },
              whiteSpace: "nowrap",
              "&:hover": {
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #a00000 0%, #ff4444 100%)"
                    : "linear-gradient(135deg, #c00000 0%, #dc143c 100%)",
              },
            }}
          >
            {currentUpdate.linkText[locale]}
          </Button>
        )}
      </Box>

      {/* Dots Navigation - Solo si hay más de 1 update */}
      {activeUpdates.length > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mt: 2,
          }}
        >
          {activeUpdates.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor:
                  index === currentIndex
                    ? (theme) =>
                        theme.palette.mode === "dark" ? "#dc143c" : "#8b0000"
                    : (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.3)"
                          : "rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#ff4444" : "#dc143c",
                  transform: "scale(1.2)",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
