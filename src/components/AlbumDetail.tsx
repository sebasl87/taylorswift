"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Chip,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Stack,
  Tooltip,
  CardContent,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Album, Track } from "@/types/album";
import {
  getAlbumDescription,
  getMusicianInstrument,
} from "@/utils/albumHelpers";
import { slugify } from "@/utils/slugify";
import { renderLyricsWithBold } from "@/utils/renderLyrics";
import LyricsIcon from "@mui/icons-material/MusicNote";
import InfoIcon from "@mui/icons-material/Info";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "./NewsBanner";
import discographyData from "@/constants/discography.json";
import liveAlbumsData from "@/constants/liveAlbums.json";
import compilationsData from "@/constants/compilations.json";
import epsData from "@/constants/eps.json";
import { CommentsSection } from "./CommentsSection";

interface AlbumDetailProps {
  album: Album;
}

export default function AlbumDetail({ album }: AlbumDetailProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const t = useTranslations("albumDetail");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();

  // Determinar tipo de álbum y obtener álbumes relacionados
  const relatedAlbums = useMemo(() => {
    // Determinar qué tipo de álbum es el actual
    const studioList = discographyData as unknown as Album[];
    const liveList = liveAlbumsData as unknown as Album[];
    const compList = compilationsData as unknown as Album[];
    const epList = epsData as unknown as Album[];
    const isStudio = studioList.some((a) => a.id === album.id);
    const isLive = liveList.some((a) => a.id === album.id);
    const isCompilation = compList.some((a) => a.id === album.id);
    const isEP = epList.some((a) => a.id === album.id);

    let sourceData: Album[] = [];
    if (isStudio) sourceData = studioList;
    else if (isLive) sourceData = liveList;
    else if (isCompilation) sourceData = compList;
    else if (isEP) sourceData = epList;

    // Filtrar álbumes (excluir el actual) y seleccionar 3 aleatorios
    const filtered = sourceData.filter((a) => a.id !== album.id);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [album.id]);

  const handleTrackClick = (track: Track) => {
    if (track.lyrics) {
      setSelectedTrack(track);
      setLyricsOpen(true);
    }
  };

  const handleCloseLyrics = () => {
    setLyricsOpen(false);
    setSelectedTrack(null);
  };

  // Generar Schema.org MusicAlbum
  const albumSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "MusicAlbum",
      name: album.title,
      byArtist: {
        "@type": "MusicGroup",
        name: "Taylor Swift",
      },
      datePublished: album.releaseDate || `${album.year}-01-01`,
      genre: ["Pop", "Country", "Alternative"],
      image: `https://taylorswift.com${album.cover}`,
      ...(album.label && { recordLabel: album.label }),
      ...(album.producers &&
        album.producers.length > 0 && {
          producer: album.producers.map((p) => ({
            "@type": "Person",
            name: p,
          })),
        }),
      ...(album.tracks &&
        album.tracks.length > 0 && {
          track: album.tracks.map((track) => ({
            "@type": "MusicRecording",
            name: track.title,
            position: track.n,
            ...(track.duration && { duration: track.duration }),
            ...(track.writers &&
              track.writers.length > 0 && {
                composer: track.writers.map((w) => ({
                  "@type": "Person",
                  name: w,
                })),
              }),
          })),
          numTracks: album.tracks.length,
        }),
    };
  }, [album]);

  return (
    <ContainerGradientNoPadding>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(albumSchema),
        }}
      />

      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 4 }}>
        <Breadcrumb
          items={[
            { label: tb("discography"), href: "/discography" },
            { label: album.title },
          ]}
        />
      </Box>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
        <Grid container spacing={4}>
          {/* Portada del álbum */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 4,
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              <Image
                src={album.cover}
                alt={`${album.title} cover`}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
          </Grid>

          {/* Información del álbum */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontSize: { xs: "2rem", md: "3rem" },
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {album.title}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Chip label={album.year} color="primary" variant="filled" />
                  {album.isUpcoming && (
                    <Chip
                      label={t("upcoming") || "Próximo"}
                      color="secondary"
                      variant="filled"
                    />
                  )}
                </Stack>

                {album.description && (
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, color: "text.secondary" }}
                  >
                    {getAlbumDescription(album, locale, "extended")}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {t("details") || "Detalles"}
                </Typography>
                <Stack spacing={1}>
                  {album.label && (
                    <Typography variant="body2">
                      <strong>{t("label") || "Sello"}:</strong> {album.label}
                    </Typography>
                  )}
                  {album.producers && album.producers.length > 0 && (
                    <Typography variant="body2">
                      <strong>{t("producers") || "Productores"}:</strong>{" "}
                      {album.producers.join(", ")}
                    </Typography>
                  )}
                  {album.releaseDate && (
                    <Typography variant="body2">
                      <strong>
                        {t("releaseDate") || "Fecha de lanzamiento"}:
                      </strong>{" "}
                      {album.releaseDate}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Formación de la banda */}
        {album.musicians && album.musicians.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ mb: 3, fontWeight: 700 }}
            >
              {t("lineup") || "Formación"}
            </Typography>

            <Card variant="outlined">
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {album.musicians.map((musician, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Stack spacing={0.5}>
                        <Link
                          href={
                            musician.name === "VA"
                              ? "/miembros"
                              : `/miembros/${slugify(musician.name)}`
                          }
                          passHref
                          legacyBehavior
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "color 0.2s",
                              color: "text.primary",
                              "&:hover": {
                                color: "primary.main",
                              },
                            }}
                          >
                            {musician.name}
                          </Typography>
                        </Link>
                        <Typography variant="body2" color="text.secondary">
                          {getMusicianInstrument(musician.instrument, locale)}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
          </Box>
        )}

        {/* Lista de canciones */}
        {album.tracks && album.tracks.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ mb: 3, fontWeight: 700 }}
            >
              {t("tracklist") || "Lista de canciones"}
            </Typography>

            <Card variant="outlined">
              <List sx={{ p: 0 }}>
                {album.tracks.map((track, index) => (
                  <Box key={track.n}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={0}
                            alignItems="center"
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                minWidth: 24,
                                color: "text.secondary",
                                fontWeight: 600,
                              }}
                            >
                              {track.n}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {track.title}
                            </Typography>
                            {track.lyrics && (
                              <Tooltip title={t("viewLyrics") || "Ver letras"}>
                                <Box
                                  onClick={() => handleTrackClick(track)}
                                  padding="4px"
                                  sx={{ cursor: "pointer" }}
                                >
                                  <LyricsIcon
                                    fontSize="small"
                                    sx={{ color: "primary.main" }}
                                  />
                                </Box>
                              </Tooltip>
                            )}
                          </Stack>
                        }
                        secondary={
                          <Box
                            component="span"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {track.duration && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                component="span"
                                sx={{ display: "block", mb: 0.5 }}
                              >
                                {t("duration") || "Duración"}: {track.duration}
                              </Typography>
                            )}
                            {track.writers && track.writers.length > 0 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                component="span"
                                sx={{ display: "block" }}
                              >
                                {t("writers") || "Compositores"}:{" "}
                                {track.writers.join(", ")}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      {track.lyrics && (
                        <Link
                          href={`/songs/${track.title
                            .toLowerCase()
                            .replace(/[^a-z0-9 ]/gi, "")
                            .replace(/ /g, "-")}`}
                          passHref
                          legacyBehavior
                        >
                          <Tooltip
                            title={
                              t("viewSongDetails") ||
                              "Ver detalle de la canción"
                            }
                          >
                            <Box padding="4px" sx={{ cursor: "pointer" }}>
                              <InfoIcon
                                fontSize="large"
                                sx={{ color: "primary.main" }}
                              />
                            </Box>
                          </Tooltip>
                        </Link>
                      )}
                    </ListItem>
                    {index < (album.tracks?.length || 0) - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Card>
          </Box>
        )}

        {/* Modal de letras */}
        <Dialog
          open={lyricsOpen}
          onClose={handleCloseLyrics}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxHeight: "85vh",
            },
          }}
        >
          <DialogTitle>{selectedTrack?.title}</DialogTitle>
          <DialogContent
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                },
              },
              // Para Firefox
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-line",
                fontFamily: "monospace",
                lineHeight: 1.6,
              }}
            >
              {selectedTrack?.lyrics
                ? renderLyricsWithBold(selectedTrack.lyrics)
                : t("noLyrics") || "Letras no disponibles"}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLyrics}>
              {t("close") || "Cerrar"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Álbumes relacionados */}
        {relatedAlbums.length > 0 && (
          <Box sx={{ mt: 6, maxWidth: 900, mx: "auto" }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
              }}
            >
              {t("relatedAlbums") || "Álbumes relacionados"}
            </Typography>
            <Grid container spacing={2}>
              {relatedAlbums.map((relatedAlbum) => (
                <Grid size={{ xs: 6, sm: 4, md: 4 }} key={relatedAlbum.id}>
                  <Link
                    href={`/discography/${relatedAlbum.id}`}
                    passHref
                    legacyBehavior
                  >
                    <Card
                      component="a"
                      sx={{
                        textDecoration: "none",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          paddingTop: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={relatedAlbum.cover}
                          alt={relatedAlbum.title}
                          fill
                          sizes="(max-width: 600px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                      <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
                        <Typography
                          variant="body2"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: { xs: "0.85rem", md: "0.95rem" },
                            lineHeight: 1.3,
                          }}
                        >
                          {relatedAlbum.title}
                        </Typography>
                        <Chip
                          label={relatedAlbum.year}
                          size="small"
                          sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box mt={4}>
          <RandomSectionBanner currentSection="discography" />
        </Box>

        <CommentsSection
          pageType="article"
          pageId={album.id}
          title={album.title}
        />
      </Container>
    </ContainerGradientNoPadding>
  );
}
