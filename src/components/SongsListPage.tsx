"use client";
import { useState, useMemo } from "react";
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { getAllSongs, Song } from "@/utils/songs";
import { Link } from "@/i18n/navigation";
import discographyData from "@/constants/discography.json";
import songsCountData from "@/constants/songs.counts.fixed.json";

import Breadcrumb from "./Breadcrumb";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "./NewsBanner";
import { CommentsSection } from "./CommentsSection";
import { useEra } from "@/context/EraContext";

interface AlbumGroup {
  id: string;
  title: string;
  year: number;
  songs: Song[];
}

const albumOrder = new Map(discographyData.map((album, i) => [album.id, i]));

// Agrupa las canciones por álbum (más reciente primero) para que todas
// queden presentes en el HTML desde el primer render, sin paginación oculta
// detrás de clicks que Google nunca llega a ver.
function groupByAlbum(songs: Song[]): AlbumGroup[] {
  const groups = new Map<string, AlbumGroup>();

  for (const song of songs) {
    const key = song.album.id;
    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        title: song.album.title,
        year: song.album.year,
        songs: [],
      });
    }
    groups.get(key)!.songs.push(song);
  }

  return Array.from(groups.values())
    .sort(
      (a, b) =>
        b.year - a.year ||
        (albumOrder.get(b.id) ?? 0) - (albumOrder.get(a.id) ?? 0),
    )
    .map((group) => ({
      ...group,
      songs: group.songs.sort(
        (a, b) => a.details.track_number - b.details.track_number,
      ),
    }));
}

// Función para normalizar título (quitar Taylor's Version para matching)
function normalizeTitle(title: string): string {
  return title.replace(/\s*\(Taylor's Version\)\s*/gi, "").trim();
}

function getFilterValue(song: Song, filter: string) {
  const lower = filter.toLowerCase();
  return (
    song.title.toLowerCase().includes(lower) ||
    song.album.title.toLowerCase().includes(lower) ||
    song.album.year.toString().includes(lower) ||
    song.credits.musicians.some((m) => {
      const nameMatch = m.name.toLowerCase().includes(lower);
      let instrumentText = "";
      if (typeof m.instrument === "string") {
        instrumentText = m.instrument.toLowerCase();
      } else if (m.instrument && typeof m.instrument === "object") {
        instrumentText = `${m.instrument.es.toLowerCase()} ${m.instrument.en.toLowerCase()}`;
      }
      return nameMatch || instrumentText.includes(lower);
    }) ||
    song.credits.writers.lyrics
      .concat(song.credits.writers.music)
      .some((w) => w.toLowerCase().includes(lower))
  );
}

export default function SongsListPage() {
  const t = useTranslations("songs");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();
  const { currentEra } = useEra();
  const [filter, setFilter] = useState("");

  const allSongs: Song[] = getAllSongs();
  const songsCounts: Record<string, number> = songsCountData;

  // Deduplicar canciones: si existe "Song" y "Song (Taylor's Version)",
  // mantener solo el original (para mostrar año original)
  const songs = useMemo(() => {
    const songsMap = new Map<string, Song>();

    allSongs.forEach((song) => {
      const normalizedTitle = normalizeTitle(song.title);
      const existing = songsMap.get(normalizedTitle);

      // Si no existe, agregar
      if (!existing) {
        songsMap.set(normalizedTitle, song);
      } else {
        // Si existe, preferir la versión ORIGINAL (sin Taylor's Version)
        const isTaylorsVersion = song.title.includes("Taylor's Version");
        const existingIsTaylorsVersion =
          existing.title.includes("Taylor's Version");

        // Si la nueva es original y la existente es Taylor's Version, reemplazar
        if (!isTaylorsVersion && existingIsTaylorsVersion) {
          songsMap.set(normalizedTitle, song);
        }
        // Si ambas son originales o ambas son TV, mantener la existente
      }
    });

    return Array.from(songsMap.values());
  }, [allSongs]);

  // Obtener top 10 canciones más tocadas
  const top10Songs = Object.entries(songsCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([title, count]) => ({
      title,
      count,
      song: songs.find(
        (s) => normalizeTitle(s.title) === normalizeTitle(title),
      ),
    }))
    .filter((item) => item.song !== undefined);

  // Función para verificar si una canción está en el top 10
  const isTop10 = (songTitle: string): boolean => {
    return top10Songs.some((item) => item.title === songTitle);
  };

  // Función helper para obtener el número de veces tocada
  const getTimesPlayed = (songTitle: string): number => {
    const normalized = normalizeTitle(songTitle);
    return songsCounts[normalized] || 0;
  };

  const filtered = filter
    ? songs.filter((song) => getFilterValue(song, filter))
    : songs;

  const albumGroups = groupByAlbum(filtered);

  return (
    <ContainerGradientNoPadding>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
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
            zIndex: 0,
          },
        }}
      >
        <Box
          pt="100px"
          px={{ xs: 2, md: 0 }}
          pb={{ xs: 2, md: 0 }}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Breadcrumb items={[{ label: tb("songs") }]} />
        </Box>
        <Container
          maxWidth={false}
          sx={{ maxWidth: 1440, mx: "auto", position: "relative", zIndex: 1 }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={"100%"}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 32, md: 56 },
                mb: 3,
                fontWeight: 700,
                color: currentEra.colors.heroText || "#FFFFFF",
                textShadow: `2px 2px 8px ${currentEra.shadowColor}, 0 0 20px ${currentEra.shadowColor}`,
                transition: "color 0.5s ease, text-shadow 0.5s ease",
              }}
            >
              {t("title")}
            </Typography>
          </Box>

          {/* Top 10 Canciones más tocadas */}
          <Card sx={{ mb: 4, p: 3 }}>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: 24, md: 32 }, mb: 1, fontWeight: 700 }}
            >
              {t("top10Title")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: 14, md: 16 } }}
            >
              {t("top10Description")}
            </Typography>
            <Grid container spacing={2}>
              {top10Songs.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={item.title}>
                  <Card
                    component={Link}
                    href={`/songs/${item.song!.id}`}
                    sx={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      border: "1px solid",
                      borderColor: "primary.main",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography
                          variant="h3"
                          color="primary"
                          sx={{
                            fontWeight: 700,
                            minWidth: 40,
                            fontSize: { xs: 32, md: 40 },
                          }}
                        >
                          {index + 1}
                        </Typography>
                        <Box flex={1}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: 16, md: 18 },
                              mb: 0.5,
                            }}
                          >
                            {item.title}
                          </Typography>
                          {item.song && (
                            <Chip
                              label={item.song.album.title}
                              size="small"
                              sx={{ fontSize: { xs: 10, md: 11 }, mb: 0.5 }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1, fontSize: { xs: 13, md: 14 } }}
                          >
                            {item.count} {locale === "es" ? "veces" : "times"}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: 24, md: 32 },
              mb: 1,
              fontWeight: 700,
              pt: 3,
              pb: 2,
              color: currentEra.colors.heroText || "#FFFFFF",
              textShadow: `2px 2px 8px ${currentEra.shadowColor}, 0 0 20px ${currentEra.shadowColor}`,
              transition: "color 0.5s ease, text-shadow 0.5s ease",
            }}
          >
            {t("titleTable")}
          </Typography>

          <TextField
            label={t("search")}
            variant="outlined"
            fullWidth
            sx={{ mb: 4 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {albumGroups.map((group) => (
            <Box key={group.id} component="section" sx={{ mb: 5 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 22, md: 28 },
                  fontWeight: 700,
                  mb: 2,
                  color: currentEra.colors.heroText || "#FFFFFF",
                  textShadow: `2px 2px 8px ${currentEra.shadowColor}`,
                }}
              >
                <Link
                  href={`/discography/${group.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {group.title} ({group.year})
                </Link>
              </Typography>

              {/* Tabla solo visible en desktop */}
              <TableContainer
                component={Paper}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <Table size="small" sx={{ tableLayout: "fixed" }}>
                  <TableHead
                    sx={{ backgroundColor: "primary.main", height: 50 }}
                  >
                    <TableRow>
                      <TableCell sx={{ width: "38%" }}>
                        <Typography fontWeight={600} fontSize={18} color="white">
                          {t("title")}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: "24%" }}>
                        <Typography fontWeight={600} fontSize={18} color="white">
                          {t("album")}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <Typography fontWeight={600} fontSize={18} color="white">
                          {t("year")}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: "12%" }}>
                        <Typography fontWeight={600} fontSize={18} color="white">
                          {t("duration")}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: "16%" }}>
                        <Typography fontWeight={600} fontSize={18} color="white">
                          {t("timesPlayed")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.songs.map((song) => (
                      <TableRow
                        key={song.id}
                        hover
                        sx={{
                          cursor: "pointer",
                          height: 55,
                          position: "relative",
                        }}
                      >
                        <TableCell>
                          {/* Stretched link: un <a> real que cubre toda la
                              fila (position: relative va en el TableRow) */}
                          <Link
                            href={`/songs/${song.id}`}
                            aria-label={song.title}
                            style={{ position: "absolute", inset: 0 }}
                          />
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontWeight={500}>{song.title}</Typography>
                            {isTop10(song.title) && (
                              <Chip
                                label="TOP 10"
                                color="error"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: 10 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={song.album.title} sx={{ mr: 1 }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={song.album.year} color="secondary" />
                        </TableCell>
                        <TableCell>{song.details.duration}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getTimesPlayed(song.title)}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Cards solo visibles en mobile/tablet */}
              <Grid
                container
                spacing={2}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                {group.songs.map((song) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={song.id}>
                    <Card>
                      <CardActionArea
                        component={Link}
                        href={`/songs/${song.id}`}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="h6" component="h3" fontWeight={600}>
                              {song.title}
                            </Typography>
                            {isTop10(song.title) && (
                              <Chip
                                label="TOP 10"
                                color="error"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: 10 }}
                              />
                            )}
                          </Box>
                          <Chip label={song.album.title} sx={{ mr: 1, mb: 1 }} />
                          <Chip
                            label={song.album.year}
                            color="secondary"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {t("duration")}: {song.details.duration}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {t("timesPlayedLive")}: {getTimesPlayed(song.title)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Container>
        <Box
          pb={4}
          sx={{
            px: { xs: 2, sm: 2, md: 0 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <RandomSectionBanner currentSection="songs" />
          <Box sx={{ maxWidth: 1440, mx: "auto" }}>
            <CommentsSection
              pageType="article"
              pageId="songs-list"
              customSubtitle={t("preSubtitle")}
            />
          </Box>
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
