"use client";

import { Box, Typography, Card, CardContent, Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import songsCountsData from "@/constants/songs.counts.fixed.json";

function songNameToUrl(songName: string): string {
  return songName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, "")
    .replace(/ /g, "-");
}

export default function TopSongsWidget() {
  const t = useTranslations("topSongs");

  // Convertir objeto a array y ordenar por veces tocadas
  const counts = songsCountsData as unknown as Record<string, number>;
  const topSongs = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 10);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        {/* Imagen de encabezado con título superpuesto */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 180, md: 220 },
          }}
        >
          <Image
            src="/images/cards-home/topsongs2.jpg"
            alt={t("title")}
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Título superpuesto */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 3 },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: 24, md: 32 },
                fontWeight: 600,
                color: "white",
                textAlign: "left",
              }}
            >
              {t("title")}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
          {/* Subtítulo */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, textAlign: "center", fontSize: { xs: 13, md: 14 } }}
          >
            {t("subtitle")}
          </Typography>

          {/* Lista de canciones */}
          {topSongs.map((song, index) => (
            <Box key={song.name}>
              {index > 0 && <Divider sx={{ my: 1.5 }} />}
              <Link
                href={`/songs/${songNameToUrl(song.name)}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                    borderRadius: 1,
                    px: 1,
                    mx: -1,
                  }}
                >
                  {/* Posición */}
                  <Box
                    sx={{
                      minWidth: 35,
                      fontSize: { xs: 18, md: 22 },
                      fontWeight: 700,
                      color: index < 3 ? "primary.main" : "text.secondary",
                    }}
                  >
                    {index + 1}
                  </Box>

                  {/* Nombre de la canción */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: 14, md: 16 },
                        fontWeight: 500,
                      }}
                    >
                      {song.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: 12, md: 13 } }}
                    >
                      {song.count.toLocaleString()} {t("timesPlayed")}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </Box>
          ))}

          {/* Link para ver todas */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: "auto",
              pt: 3,
            }}
          >
            <Typography
              component={Link}
              href="/songs"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: { xs: 14, md: 16 },
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("viewAll")} →
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
