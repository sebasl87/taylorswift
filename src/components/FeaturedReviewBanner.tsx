"use client";

import { Box, Card, Typography, Button } from "@mui/material";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import bannerData from "@/constants/featured-banner.json";

export default function FeaturedReviewBanner() {
  const locale = useLocale() as "es" | "en";

  // Si no está activo, no mostrar nada
  if (!bannerData.isActive) {
    return null;
  }

  // JSON-LD para el banner destacado
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PromotionCard",
    name: bannerData.title[locale],
    description: bannerData.subtitle[locale],
    url: `https://taylorswift.com${bannerData.link}`,
    image: `https://taylorswift.com${bannerData.imageUrl}`,
    inLanguage: locale,
  };

  return (
    <>
      {/* JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Box sx={{ my: 4, maxWidth: 1440, width: "100%" }}>
        <Card
          component="article"
          elevation={2}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: 8,
              transform: "translateY(-4px)",
            },
          }}
          aria-label={bannerData.title[locale]}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.5fr" },
              minHeight: { xs: "auto", md: 300 },
            }}
          >
            {/* Imagen */}
            <Box
              sx={{
                position: "relative",
                height: { xs: 250, md: "auto" },
                minHeight: { xs: 250, md: 300 },
              }}
            >
              <Image
                src={bannerData.imageUrl}
                alt={bannerData.title[locale]}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: {
                    xs: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)",
                    md: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 100%)",
                  },
                }}
              />
            </Box>

            {/* Contenido */}
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  color: "primary.main",
                }}
              >
                {bannerData.title[locale]}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.7,
                  fontSize: { xs: "0.9rem", md: "1.1rem" },
                  color: "text.secondary",
                }}
              >
                {bannerData.subtitle[locale]}
              </Typography>

              <Box>
                <Button
                  component={Link}
                  href={bannerData.link}
                  variant="contained"
                  size="large"
                  aria-label={bannerData.cta[locale]}
                  sx={{
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  {bannerData.cta[locale]}
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  );
}
