"use client";
import VideosGrid from "@/components/VideosGrid";
import videosData from "@/constants/videos.json";
import type { Video } from "@/types/video";
import { Box } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { useEra } from "@/context/EraContext";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "@/components/NewsBanner";

export default function VideosPageClient() {
  const { currentEra } = useEra();
  const locale = useLocale();
  const tb = useTranslations("breadcrumb");
  const v = useTranslations("videos");

  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
        <VideosGrid videos={videosData as Video[]} />
        <Box sx={{ mt: 8, mb: 4 }}>
          <RandomSectionBanner currentSection="videos" />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
