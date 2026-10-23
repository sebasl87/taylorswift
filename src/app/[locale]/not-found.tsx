"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container, Typography, Box, Button } from "@mui/material";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import { useEra } from "@/context/EraContext";

export default function NotFound() {
  const t = useTranslations("notFound");
  const { currentEra } = useEra();

  return (
    <ContainerGradientNoPadding>
      <Box
        sx={{
          background: currentEra.colors.heroOverlay,
          minHeight: "100vh",
        }}
        pt="100px"
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 1440,
            mx: "auto",
            py: 8,
            px: { xs: 2, md: 4 },
            pt: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: 260, sm: 360, md: 480 },
              height: { xs: 260, sm: 360, md: 480 },
              mb: 4,
            }}
          >
            <Image
              src="/images/404.png"
              alt="404"
              style={{ objectFit: "cover", borderRadius: 16 }}
              priority
              fill
            />
          </Box>

          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            color={currentEra.colors.heroText}
            sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" }, mb: 2 }}
          >
            {t("heading")}
          </Typography>

          <Typography
            variant="body1"
            color={currentEra.colors.heroText}
            sx={{
              mb: 1,
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              maxWidth: 560,
            }}
          >
            {t("message")}
          </Typography>

          <Typography
            variant="body2"
            color={currentEra.colors.heroText}
            sx={{
              mb: 4,
              fontSize: { xs: "0.875rem", md: "1rem" },
              maxWidth: 560,
              opacity: 0.85,
            }}
          >
            {t("suggestions")}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            href="/"
            size="large"
            sx={{ fontWeight: 600 }}
          >
            {t("goHome")}
          </Button>
        </Container>
      </Box>
    </ContainerGradientNoPadding>
  );
}
