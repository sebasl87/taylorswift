"use client";
import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import songsData from "@/constants/songs.json";
import songsCountData from "@/constants/songs.counts.fixed.json";
import Link from "next/link";
import Image from "next/image";
import membersData from "@/constants/members.json";
import Breadcrumb from "./Breadcrumb";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "./NewsBanner";
import { CommentsSection } from "./CommentsSection";
import { slugify } from "@/utils/slugify";
import { renderLyricsWithBold } from "@/utils/renderLyrics";

interface SongDetailPageProps {
  songId: string;
}

export default function SongDetailPage({ songId }: SongDetailPageProps) {
  const t = useTranslations("songs");
  const tb = useTranslations("breadcrumb");
  const [showEs, setShowEs] = useState(false);
  const locale = useLocale();
  const songsList = songsData as unknown as {
    id: string;
    title: string;
    album: { title: string; year: number; cover: string; songArtwork?: string };
    details?: { duration?: string; track_number?: number };
    theme: { es: string; en: string };
    credits: { writers: { lyrics: string[]; music: string[] }; musicians: { name: string; instrument?: string | { es: string; en: string } }[] };
    lyrics?: { es?: string; en?: string };
  }[];
  const song = songsList.find((s) => s.id === songId);
  const songsCounts: Record<string, number> = songsCountData;

  // Obtener top 10 canciones más tocadas
  const top10Songs = Object.entries(songsCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([title]) => title);

  // Instrument y theme dependen del idioma global
  const instrumentKey = locale === "es" ? "es" : "en";

  // Obtener otras canciones del mismo álbum (solo si song existe)
  const albumSongs = useMemo(() => {
    if (!song) return [];
    return songsList
      .filter((s) => s.album.title === song.album.title && s.id !== song.id)
      .sort(
        (a, b) =>
          (a.details?.track_number || 0) - (b.details?.track_number || 0),
      );
  }, [song]);

  // Generar Schema.org MusicRecording (solo si song existe)
  const songSchema = useMemo(() => {
    if (!song) return null;
    return {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      name: song.title,
      byArtist: {
        "@type": "MusicGroup",
        name: "Taylor Swift",
      },
      inAlbum: {
        "@type": "MusicAlbum",
        name: song.album.title,
        image: `https://taylorswift.com${song.album.cover}`,
      },
      ...(song.details?.duration && { duration: song.details.duration }),
      ...(song.album?.year && { datePublished: `${song.album.year}-01-01` }),
      ...(song.credits?.writers?.lyrics &&
        song.credits.writers.lyrics.length > 0 && {
          author: song.credits.writers.lyrics.map((writer) => ({
            "@type": "Person",
            name: writer,
          })),
        }),
      ...(song.credits?.musicians &&
        song.credits.musicians.length > 0 && {
          byArtist: song.credits.musicians.map((m) => ({
            "@type": "Person",
            name: m.name,
            ...(m.instrument && {
              roleName:
                typeof m.instrument === "string"
                  ? m.instrument
                  : m.instrument[instrumentKey],
            }),
          })),
        }),
      genre: ["Pop", "Country", "Alternative"],
      ...(song.lyrics &&
        song.lyrics.en && {
          lyrics: {
            "@type": "CreativeWork",
            text: song.lyrics.en,
          },
        }),
    };
  }, [song, instrumentKey]);

  if (!song)
    return (
      <ContainerGradientNoPadding>
        <Container
          maxWidth="md"
          sx={{ py: { xs: 2, md: 3 }, textAlign: "center" }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: 300, md: 600 },
              height: { xs: 200, md: 400 },
              mx: "auto",
              mb: 0,
            }}
          >
            <Image
              src="/images/404.png"
              alt="404"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            color="primary"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              mb: 2,
            }}
          >
            {t("notFoundTitle")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              mb: 1,
              lineHeight: 1.7,
            }}
          >
            {t("notFoundMessage")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              mb: 4,
              lineHeight: 1.7,
            }}
          >
            {t("notFoundAction")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
            }}
          >
            <Button
              component={Link}
              href="/songs"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: { xs: 16, md: 18 },
                fontWeight: 600,
                minWidth: { xs: 200, sm: "auto" },
              }}
            >
              {t("backToSongs")}
            </Button>
            <Button
              component={Link}
              href="/contacto"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: { xs: 16, md: 18 },
                fontWeight: 600,
                minWidth: { xs: 200, sm: "auto" },
              }}
            >
              {t("goToContact")}
            </Button>
          </Box>
        </Container>
      </ContainerGradientNoPadding>
    );

  const isTop10 = top10Songs.includes(song.title);
  const themeText = song.theme[instrumentKey];
  const timesPlayed = songsCounts[song.title] || 0;

  return (
    <ContainerGradientNoPadding>
      {/* Schema.org JSON-LD */}
      {songSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(songSchema),
          }}
        />
      )}
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
        <Breadcrumb
          items={[
            { label: tb("songs"), href: "/songs" },
            { label: song.title },
          ]}
        />
      </Box>
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", pt: { xs: 2, md: 4 } }}
      >
        <Box
          display="flex"
          alignItems={{ xs: "center", md: "flex-start" }}
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          pb={4}
        >
          <Card sx={{ minWidth: 220, maxWidth: 220, boxShadow: 4 }}>
            <Box
              sx={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: 4,
                border: "1.5px solid",
                borderColor: "primary.main",
                cursor: "pointer",
              }}
            >
              <Link href={`/discography/${slugify(song.album.title)}`} passHref>
                <Image
                  src={song.album.cover}
                  alt={song.album.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Link>
            </Box>
          </Card>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Typography
                variant="h1"
                fontWeight={600}
                sx={{ fontSize: { md: 48, xs: 36 } }}
              >
                {song.title}
              </Typography>
              {isTop10 && (
                <Chip
                  label="TOP 10"
                  color="error"
                  sx={{ fontWeight: 700, fontSize: { xs: 12, md: 14 } }}
                />
              )}
            </Box>
            <Box pt={2}>
              <Link href={`/discography/${slugify(song.album.title)}`} passHref>
                <Chip label={song.album.title} sx={{ mr: 1, mb: 1 }} />
              </Link>
              <Chip
                label={song.album.year}
                color="secondary"
                sx={{ mb: 1, mr: 1 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t("duration")}: {song.details?.duration ?? ""}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t("track")}: {song.details?.track_number ?? ""}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t("timesPlayedLive")}: <strong>{timesPlayed}</strong>
            </Typography>
            <Card sx={{ padding: 2, mt: 3, boxShadow: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {t("writers")}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {t("lyricsBy")}: {song.credits.writers.lyrics.join(", ")}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                {t("musicBy")}: {song.credits.writers.music.join(", ")}
              </Typography>
            </Card>
            <Card sx={{ padding: 2, mt: 3, boxShadow: 2, mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {t("theme")}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {themeText}
              </Typography>
            </Card>

            <Box
              display={"flex"}
              width={"100%"}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 600 }}>
                {t("lyrics")}
              </Typography>
              <Button variant="outlined" onClick={() => setShowEs((e) => !e)}>
                {showEs ? t("showEn") : t("showEs")}
              </Button>
            </Box>

            <Box
              sx={{
                whiteSpace: "pre-line",
                fontFamily: "monospace",
                fontSize: 16,
                background: "rgba(0,0,0,0.04)",
                p: 2,
                borderRadius: 2,
                mb: 2,
              }}
            >
              {showEs
                ? song.lyrics?.es
                  ? renderLyricsWithBold(song.lyrics.es)
                  : t("lyricsNotAvailable")
                : song.lyrics?.en
                  ? renderLyricsWithBold(song.lyrics.en)
                  : t("lyricsNotAvailable")}
            </Box>

            {/* Song Artwork */}
            {song.album.songArtwork && (
              <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  {t("songArtwork")}
                </Typography>
                <Card sx={{ maxWidth: 400, boxShadow: 4 }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1/1",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={song.album.songArtwork}
                      alt={`${song.title} artwork`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                </Card>
              </Box>
            )}

            <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 600 }}>
              {t("musicians")}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {song.credits.musicians.map((m) => {
                const memberId = slugify(m.name);
                const membersMap = Array.isArray(membersData as unknown)
                  ? {}
                  : ((membersData as unknown as { members?: Record<string, { image?: string }> }).members || {});
                const memberObj = membersMap[memberId];
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m.name}>
                    <Link
                      href={`/miembros/${memberId}`}
                      passHref
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          textDecoration: "none",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 8,
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          {memberObj && memberObj.image ? (
                            <Image
                              src={memberObj.image}
                              alt={m.name}
                              width={200}
                              height={200}
                              style={{
                                borderRadius: "16px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                width: 56,
                                height: 56,
                              }}
                            >
                              {m.name[0]}
                            </Avatar>
                          )}
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              color="primary"
                              sx={{
                                textDecoration: "none !important",
                                cursor: "default",
                                "&, & *": {
                                  textDecoration: "none !important",
                                },
                              }}
                            >
                              {m.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                textDecoration: "none !important",
                                cursor: "default",
                                "&, & *": {
                                  textDecoration: "none !important",
                                },
                              }}
                            >
                              {typeof m.instrument === "string"
                                ? m.instrument
                                : m.instrument &&
                                  (m.instrument as { es: string; en: string })[
                                    instrumentKey
                                  ]}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>

        {/* Otras canciones del álbum */}
        {albumSongs.length > 0 && (
          <Box sx={{ maxWidth: 800, mx: "auto", mt: 0, mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
              }}
            >
              {t("otherSongsFromAlbum") || "Otras canciones del álbum"}
            </Typography>
            <Card variant="outlined">
              <List sx={{ p: 0 }}>
                {albumSongs.map((albumSong, index) => (
                  <ListItem
                    key={albumSong.id}
                    component={Link}
                    href={`/songs/${albumSong.id}`}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderBottom: index < albumSongs.length - 1 ? 1 : 0,
                      borderColor: "divider",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: "0.9rem", md: "1rem" },
                          }}
                        >
                          {albumSong.details?.track_number && (
                            <Typography
                              component="span"
                              sx={{
                                color: "text.secondary",
                                mr: 1,
                                fontSize: { xs: "0.85rem", md: "0.95rem" },
                              }}
                            >
                              {albumSong.details.track_number}.
                            </Typography>
                          )}
                          {albumSong.title}
                        </Typography>
                      }
                      secondary={
                        albumSong.details?.duration && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                          >
                            {albumSong.details.duration}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Box>
        )}
      </Container>
      <Box pb={0} sx={{ px: { xs: 2, sm: 2, md: 0 } }}>
        <RandomSectionBanner currentSection="songs" />
      </Box>
      <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, md: 0 } }}>
        <CommentsSection
          pageType="article"
          pageId={song.id}
          title={song.title}
        />
      </Box>
    </ContainerGradientNoPadding>
  );
}
