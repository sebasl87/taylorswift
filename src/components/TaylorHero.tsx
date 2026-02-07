"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import EraSelector from "./EraSelector";
import Hero from "./Hero";
import { useEra } from "@/context/EraContext";

export default function TaylorHero() {
  const { currentEra } = useEra();

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "transparent",
        background: currentEra.gradient,
        transition: "background 0.5s ease",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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
          zIndex: 0, // Detrás del contenido
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
          paddingTop: "100px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Hero />

        <EraSelector />
        {/* <Box sx={{ mt: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              letterSpacing: 0.5,
              mb: 2,
              color: currentEra.colors.heroText || "#FFFFFF",
              textShadow: `2px 2px 8px ${currentEra.shadowColor}, 
                           0 0 20px ${currentEra.shadowColor}`,
              transition: "color 0.5s ease, text-shadow 0.5s ease",
            }}
          >
            Taylor Swift
          </Typography>
          <Typography
            sx={{
              color: currentEra.colors.heroText || "#FFFFFF",
              mb: 3,

              textShadow: `1px 1px 4px ${currentEra.shadowColor}`,
              transition: "color 0.5s ease, text-shadow 0.5s ease",
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.7,
            }}
          >
            Discografía completa, biografía detallada, galería, noticias y
            playlists curatoradas. Diseño pastel, elegante y totalmente
            responsive.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 6 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/discography"
            >
              Ver discografía
            </Button>
            <Button variant="outlined" component={Link} href="/biografia">
              Leer biografía
            </Button>
            <Button variant="outlined" component={Link} href="/musica">
              Escuchar playlists
            </Button>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                title: "Galería",
                href: "/galeria",
                desc: "Conciertos y sesiones fotográficas",
              },
              {
                title: "Noticias",
                href: "/noticias",
                desc: "Actualizaciones y eventos",
              },
              {
                title: "Tienda",
                href: "/tienda",
                desc: "Merchandising oficial",
              },
            ].map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 24px ${currentEra.shadowColor}`,
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mt: 1 }}>
                      {item.desc}
                    </Typography>
                    <Button component={Link} href={item.href} sx={{ mt: 2 }}>
                      Explorar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box> */}
      </Container>
    </Box>
  );
}
