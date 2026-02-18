"use client";
import VideosGrid from "@/components/VideosGrid";
import videosData from "@/constants/videos.json";
import type { Video } from "@/types/video";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEra } from "@/context/EraContext";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "@/components/NewsBanner";
import Breadcrumb from "@/components/Breadcrumb";

export default function VideosPageClient() {
  const { currentEra } = useEra();
  const v = useTranslations("videos");

  return (
    <ContainerGradientNoPadding>
      {/* Overlay con el color de la era */}
      <Box
        sx={{
          background: currentEra.colors.heroOverlay,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box
          sx={{
            maxWidth: 1440,
            mx: "auto",
            px: { xs: 2, md: 0 },
            pt: "100px",
            pb: 4,
          }}
        >
          <Box mb={3}>
            <Breadcrumb items={[{ label: v("title"), href: "/videos" }]} />
          </Box>
          <VideosGrid videos={videosData as Video[]} />
          <Box sx={{ mt: 8, mb: 4 }}>
            <RandomSectionBanner currentSection="videos" />
          </Box>
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
