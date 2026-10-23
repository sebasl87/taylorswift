// Fallback global para URLs que no matchean NINGÚN segmento [locale] (ej.
// una ruta que no existe en absoluto). Next.js genera una única ruta
// `_not-found` a nivel raíz que renderiza a través del layout.tsx raíz real
// (el shell mínimo sin <html>/<body>) — este archivo tiene que proveer su
// propio <html>/<body>/fuentes, porque no hereda nada de [locale]/layout.tsx.
// No puede saber el locale (no matcheó ninguna ruta con ese segmento), así
// que queda fijo en inglés (mismos textos que messages/en.json → notFound) —
// es un último recurso, no reemplaza al [locale]/not-found.tsx traducido,
// que cubre los notFound() llamados desde adentro de una ruta real.
import type { Metadata } from "next";
import Image from "next/image";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Container, Typography, Box, Button } from "@mui/material";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { EraProvider } from "@/context/EraContext";
import { ERAS } from "@/constants/eras";
import "@/styles/globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "404 - Page not found",
  description:
    "Sorry, the page you are looking for does not exist or has been moved.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  const era = ERAS[0];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfairDisplay.variable} ${montserrat.variable}`}>
        <EraProvider>
          <ThemeRegistry>
            <Box sx={{ background: era.colors.heroOverlay, minHeight: "100vh" }}>
              <Container
                maxWidth={false}
                sx={{
                  maxWidth: 1440,
                  mx: "auto",
                  py: 8,
                  px: { xs: 2, md: 4 },
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
                  color={era.colors.heroText}
                  sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" }, mb: 2 }}
                >
                  Page not found
                </Typography>
                <Typography
                  variant="body1"
                  color={era.colors.heroText}
                  sx={{ mb: 4, fontSize: { xs: "0.95rem", md: "1.1rem" }, maxWidth: 560 }}
                >
                  Sorry, the page you are looking for does not exist or has
                  been moved.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href="/"
                  size="large"
                  sx={{ fontWeight: 600 }}
                >
                  Go to home
                </Button>
              </Container>
            </Box>
          </ThemeRegistry>
        </EraProvider>
      </body>
    </html>
  );
}
