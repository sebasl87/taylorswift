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
import { useEra } from "@/context/EraContext";

export default function TaylorHero() {
  const { currentEra } = useEra();

  return (
    <Box
      sx={{
        bgcolor: "transparent",
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 10 },
        background: currentEra.gradient,
        transition: "background 0.5s ease",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container>
        <EraSelector />
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              letterSpacing: 0.5,
              mb: 2,
            }}
          >
            Taylor Swift
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 720 }}>
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
        </Box>
      </Container>
    </Box>
  );
}
