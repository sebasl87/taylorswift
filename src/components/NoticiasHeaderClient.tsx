"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Box, Typography, Button, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useEra } from "@/context/EraContext";
import Breadcrumb from "@/components/Breadcrumb";

interface Props {
  title: string;
  formattedDate: string;
  articleId?: string;
}

export default function NoticiasHeaderClient({ title, formattedDate }: Props) {
  const t = useTranslations("news");
  const tb = useTranslations("breadcrumb");
  const { currentEra } = useEra();

  return (
    <Box
      sx={{
        background: currentEra.colors.heroOverlay,
        minHeight: "auto",
        position: "relative",
      }}
    >
      <Container sx={{ pt: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
        <Breadcrumb
          items={[{ label: tb("news"), href: "/noticias" }, { label: title }]}
        />
      </Container>

      <Container
        sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}
      >
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: currentEra.colors.heroText,
              textShadow: `2px 2px 4px ${currentEra.shadowColor}`,
              fontFamily: "Playfair Display, serif",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            paragraph
            sx={{
              color: currentEra.colors.heroText,
              textShadow: `1px 1px 2px ${currentEra.shadowColor}`,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {t("subtitle")}
          </Typography>

          <Button
            component={Link}
            href="/noticias"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            {tb("backToNews") || "Back to News"}
          </Button>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            {formattedDate}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
