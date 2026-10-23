"use client";

import { useTranslations } from "next-intl";
import DiscographyGrid from "@/components/DiscographyGrid";
import { Album } from "@/types/album";
import { Typography, Box } from "@mui/material";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Breadcrumb from "@/components/Breadcrumb";
import { useEra } from "@/context/EraContext";
import RandomSectionBanner from "@/components/NewsBanner";

interface DiscographyClientProps {
  albums: Album[];
}

export default function DiscographyClient({ albums }: DiscographyClientProps) {
  const t = useTranslations("discography");
  const { currentEra } = useEra();

  return (
    <ContainerGradientNoPadding>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: currentEra.colors.heroOverlay || "rgba(0,0,0,0.2)",
            pointerEvents: "none",
            transition: "background 0.5s ease",
            zIndex: 0,
          },
        }}
      >
        <Box
          pt="100px"
          pb={{ xs: 4, md: 6 }}
          maxWidth="1440px"
          mx="auto"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Breadcrumb items={[{ label: t("title") }]} />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              mb: 4,
              color: currentEra.colors.heroText || "#FFFFFF",
              textShadow: `2px 2px 8px ${currentEra.shadowColor}, 
                         0 0 20px ${currentEra.shadowColor}`,
              transition: "color 0.5s ease, text-shadow 0.5s ease",
            }}
          >
            {t("title")}
          </Typography>

          <DiscographyGrid albums={albums} />
        </Box>
        <Box pb={4}>
          <RandomSectionBanner currentSection="discography" />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
