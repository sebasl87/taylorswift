"use client";
import { Box, Container, Typography, Divider, Grid } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  // Schema.org JSON-LD para Organization y WebSite
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Taylor Swift Fan Site",
    url: "https://taylorswift.com",
    description: t("seoDescription"),
    logo: "https://taylorswift.com/images/logo.png",
    sameAs: [
      "https://www.taylorswift.com",
      "https://www.facebook.com/TaylorSwift",
      "https://twitter.com/taylorswift13",
      "https://www.instagram.com/taylorswift/",
      "https://www.youtube.com/user/taylorswift",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Taylor Swift Fan Site",
    url: "https://taylorswift.com",
    description: t("seoDescription"),
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://taylorswift.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const footerLinks = {
    music: [
      { href: "/discography", label: t("discography") },
      { href: "/songs", label: t("songs") },
      { href: "/videos", label: t("videos") },
      { href: "/dvds", label: t("dvds") },
    ],
    band: [
      { href: "/historia", label: t("history") },
      { href: "/miembros", label: t("members") },
      { href: "/formaciones", label: t("lineups") },
      { href: "/entrevistas", label: t("interviews") },
    ],
    live: [
      { href: "/tour", label: t("tour") },
      { href: "/shows", label: t("shows") },
      { href: "/bootlegs", label: t("bootlegs") },
    ],
    info: [
      { href: "/noticias", label: t("news") },
      { href: "/faq", label: t("faq") },
      { href: "/contacto", label: t("contact") },
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
                    color: "text.secondary",
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

          {/* La Banda */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: 14, md: 16 },
                textTransform: "uppercase",
              }}
            >
              {t("band")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.band.map((link) => (
                <Typography
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="body2"
                  sx={{
                    color: "text.secondary",
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
                    color: "text.secondary",
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

          {/* Información */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: 14, md: 16 },
                textTransform: "uppercase",
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
                    color: "text.secondary",
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
            }}
          >
            {t("seoDescription")}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Descripción y enlaces legales */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {t("siteDescription")}
            </Typography>
          </Box>
          <Box component="nav" aria-label="Legal navigation">
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Typography
                component={Link}
                href="/terminos"
                variant="body2"
                color="primary"
                sx={{ textDecoration: "none", fontWeight: 500 }}
              >
                {t("terms")}
              </Typography>
              <Typography
                component={Link}
                href="/privacidad"
                variant="body2"
                color="primary"
                sx={{ textDecoration: "none", fontWeight: 500 }}
              >
                {t("privacy")}
              </Typography>
            </Box>
          </Box>
        </Box>

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
            sx={{ fontWeight: 400, textAlign: "center" }}
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
