"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ERAS } from "@/constants/eras";
import { useEra } from "@/context/EraContext";
import Image from "next/image";

// Mapeo de IDs de era a nombres de archivo de imagen
const ERA_IMAGES: Record<string, string> = {
  "taylor-swift": "/images/eras/01-taylor.jpg",
  fearless: "/images/eras/02-fearless.jpg",
  "speak-now": "/images/eras/03-speak.jpg",
  red: "/images/eras/04-red.jpg",
  "1989": "/images/eras/05-1989.jpg",
  reputation: "/images/eras/06-reputation.jpg",
  lover: "/images/eras/07-lover.jpg",
  folklore: "/images/eras/08-folklore.jpg",
  evermore: "/images/eras/09-evermore.jpg",
  midnights: "/images/eras/10-midnights.jpg",
};

export default function EraSelector() {
  const { currentEra, setEra } = useEra();
  const t = useTranslations("eraSelector");
  const [previewEraId, setPreviewEraId] = useState<string | null>(null);

  const handleMouseEnter = (eraId: string) => {
    // Solo hacer preview si no es el seleccionado actual
    if (eraId !== currentEra.id) {
      setPreviewEraId(currentEra.id); // Guardar el actual
      setEra(eraId); // Mostrar preview
    }
  };

  const handleMouseLeave = () => {
    // Volver al tema guardado
    if (previewEraId !== null) {
      setEra(previewEraId);
      setPreviewEraId(null);
    }
  };

  const handleClick = (eraId: string) => {
    // Limpiar preview y establecer permanentemente
    setPreviewEraId(null);
    setEra(eraId);
    // El Link manejará la navegación
  };

  return (
    <Box
      sx={{
        pb: 8,
        width: "100%",
      }}
      mt={4}
    >
      {/* Encabezado de la sección */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            color: currentEra.colors.heroText || "#FFFFFF",
            textShadow: `2px 2px 8px ${currentEra.shadowColor}, 
                         0 0 20px ${currentEra.shadowColor}`,
            transition: "color 0.5s ease, text-shadow 0.5s ease",
            mb: 2,
          }}
        >
          {t("title")}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: currentEra.colors.heroText || "#FFFFFF",
            textShadow: `1px 1px 4px ${currentEra.shadowColor}`,
            transition: "color 0.5s ease, text-shadow 0.5s ease",
            fontSize: { xs: "1rem", md: "1.125rem" },
            maxWidth: "800px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          {t("subtitle")}
        </Typography>
      </Box>

      {/* Grid de Cards por Era */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 3,
          width: "100%",
        }}
      >
        {ERAS.map((era) => {
          const isSelected = currentEra.id === era.id;
          const description = t(`tooltips.${era.id}`);

          return (
            <Box
              key={era.id}
              component={Link}
              href={`/era/${era.id}`}
              onClick={() => handleClick(era.id)}
              onMouseEnter={() => handleMouseEnter(era.id)}
              onMouseLeave={handleMouseLeave}
              sx={{
                display: "block",
                textDecoration: "none",
                borderRadius: 2,
                width: "100%",
                position: "relative",
                boxShadow: isSelected
                  ? `0 8px 24px ${era.shadowColor}`
                  : `0 4px 12px rgba(0,0,0,0.1)`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 32px ${era.shadowColor}`,
                  "& .era-overlay": {
                    opacity: 1,
                  },
                },
              }}
            >
              <Box sx={{ position: "relative", width: "100%" }}>
                <Image
                  src={ERA_IMAGES[era.id]}
                  alt={era.name}
                  width={600}
                  height={406}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "16px",
                  }}
                />

                {/* Overlay con descripción */}
                <Box
                  className="era-overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.3) 100%)",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 3,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      lineHeight: 1.5,
                      fontWeight: 400,
                    }}
                  >
                    {description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    display: "inline-block",
                    px: 2,
                    py: 0.5,
                    borderRadius: 12,
                    background: era.gradient,
                    color: era.colors.heroText,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    boxShadow: `0 2px 8px ${era.shadowColor}`,
                  }}
                >
                  {era.name} - {era.year}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
