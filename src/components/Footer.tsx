"use client";
import { Box, Container, Typography, Divider, Grid } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { absoluteUrl } from "@/utils/absoluteUrl";
import { useEra } from "@/context/EraContext";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const { currentEra } = useEra();

  // Schema.org JSON-LD para Organization y WebSite
  // Organization = este fan site (no la artista): url/logo propios, sin
  // sameAs a las redes oficiales de Taylor Swift. Sin SearchAction porque el
  // sitio no tiene una página /search que reciba ?q=.
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Taylor Swift Fan Site",
    url: "https://taylorswift.com.ar",
    description: t("seoDescription"),
    logo: "https://taylorswift.com.ar/icon.webp",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Taylor Swift Fan Site",
    url: absoluteUrl("/", locale),
    description: t("seoDescription"),
    inLanguage: locale,
  };

  const footerLinks = {
    music: [
      { href: "/discography", label: t("discography") },
      { href: "/era", label: t("eras") },
      { href: "/songs", label: t("songs") },
      { href: "/videos", label: t("videos") },
    ],
    live: [
      { href: "/tour", label: t("tour") },
      { href: "/shows", label: t("shows") },
    ],
    info: [
      { href: "/noticias", label: t("news") },
      { href: "/entrevistas", label: t("interviews") },
    ],
    aboutUs: [
      { href: "/faq", label: t("faq") },
      { href: "/contacto", label: t("contact") },
      { href: "/terminos", label: t("terms") },
      { href: "/privacidad", label: t("privacy") },
    ],
  };

  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{
        py: 4,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, sm: 3 } }}
      >
        {/* Sección de enlaces internos */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Música */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: 14, md: 16 },
                textTransform: "uppercase",
                color: currentEra.colors.text,
              }}
            >
              {t("music")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.music.map((link) => (
                <Typography
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="body2"
                  sx={{
                    color: currentEra.colors.text,
                    textDecoration: "none",
                    fontSize: { xs: 13, md: 14 },
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* En Vivo */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: 14, md: 16 },
                textTransform: "uppercase",
                color: currentEra.colors.text,
              }}
            >
              {t("live")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.live.map((link) => (
                <Typography
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="body2"
                  sx={{
                    color: currentEra.colors.text,
                    textDecoration: "none",
                    fontSize: { xs: 13, md: 14 },
                    "&:hover": {
                      color: currentEra.colors.text,
                    },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>
          {/* Información */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: 14, md: 16 },
                textTransform: "uppercase",
                color: currentEra.colors.text,
              }}
            >
              {t("info")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.info.map((link) => (
                <Typography
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="body2"
                  sx={{
                    color: currentEra.colors.text,
                    textDecoration: "none",
                    fontSize: { xs: 13, md: 14 },
                    "&:hover": {
                      color: currentEra.colors.text,
                    },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* FAQ */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: 14, md: 16 },
                textTransform: "uppercase",
                color: currentEra.colors.text,
              }}
            >
              {t("aboutUs")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.aboutUs.map((link) => (
                <Typography
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="body2"
                  sx={{
                    color: currentEra.colors.text,
                    textDecoration: "none",
                    fontSize: { xs: 13, md: 14 },
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Texto SEO con Keywords */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: 12,
              lineHeight: 1.8,
              textAlign: "justify",
              color: currentEra.colors.text,
            }}
          >
            {t("seoDescription")}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Copyright */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              textAlign: "center",
              color: currentEra.colors.text,
            }}
          >
            {t("disclaimer", { year: new Date().getFullYear() })}
          </Typography>
        </Box>

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </Container>
    </Box>
  );
}
