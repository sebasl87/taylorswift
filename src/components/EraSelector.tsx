"use client";

import { Box, Button, Typography, useTheme } from "@mui/material";
import { ERAS } from "@/constants/eras";
import { useEra } from "@/context/EraContext";

export default function EraSelector() {
  const { currentEra, setEra } = useEra();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(3, 1fr)",
          sm: "repeat(5, 1fr)",
          md: "repeat(10, 1fr)",
        },
        gap: { xs: 2, sm: 3 },
        py: 6,
        px: 2,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
      role="radiogroup"
      aria-label="Select Taylor Swift Era"
    >
      {ERAS.map((era) => {
        const isSelected = currentEra.id === era.id;
        return (
          <Box
            key={era.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Button
              onClick={() => setEra(era.id)}
              aria-pressed={isSelected}
              role="radio"
              aria-checked={isSelected}
              aria-label={era.name}
              sx={{
                minWidth: "auto",
                width: { xs: 64, sm: 72, md: 80 },
                height: { xs: 64, sm: 72, md: 80 },
                borderRadius: "50%",
                background: era.gradient,
                border: "none",
                boxShadow: isSelected
                  ? `inset 0 0 0 4px ${theme.palette.background.paper}, 0 0 0 2px ${era.colors.primary}, 0 8px 16px ${era.shadowColor}`
                  : `0 4px 8px rgba(0,0,0,0.1)`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isSelected
                  ? "scale(1.1) translateY(-4px)"
                  : "scale(1)",
                "&:hover": {
                  transform: "scale(1.15) translateY(-4px)",
                  boxShadow: `0 12px 24px ${era.shadowColor}`,
                },
                position: "relative",
                overflow: "hidden",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "14px", md: "15px" },
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? era.colors.primary : "text.primary",
                textAlign: "center",
                opacity: isSelected ? 1 : 0.8,
                transition: "all 0.3s ease",
                lineHeight: 1.2,
                maxWidth: "100px",
              }}
            >
              {era.name}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
