"use client";
import { useTranslations } from "next-intl";
import { Container, Typography, Box, Button } from "@mui/material";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import { useEra } from "@/context/EraContext";

export default function ContactoPageContent() {
  const t = useTranslations("contact");
  const tb = useTranslations("breadcrumb");
  const { currentEra } = useEra();

  return (
    <ContainerGradientNoPadding>
      <Box
        sx={{
          background: currentEra.colors.heroOverlay,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box pt="100px" px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("contact") }]} />
        </Box>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            color={currentEra.colors.heroText}
            fontWeight={700}
            sx={{ fontSize: { xs: "1.75rem", md: "3rem" } }}
          >
            {t("title")}
          </Typography>
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography
              variant="body1"
              color={currentEra.colors.heroText}
              sx={{ mb: 2, fontSize: { xs: "0.9rem", md: "1rem" } }}
            >
              {t("description")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="mailto:contact@taylorswiftfan.com"
              sx={{ fontWeight: 600 }}
            >
              {t("emailButton")}
            </Button>
          </Box>
        </Container>
      </Box>
    </ContainerGradientNoPadding>
  );
}
