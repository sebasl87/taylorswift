"use client";
import { useMemo } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Launch, MusicNote } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import { useEra } from "@/context/EraContext";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Show,
  formatShowDate,
  getYouTubeVideoId,
  getShowHistoricDescription,
} from "@/types/show";
import RandomSectionBanner from "./NewsBanner";
import showsData from "@/constants/shows.json";
import { CommentsSection } from "./CommentsSection";

interface ShowDetailPageProps {
  show: Show;
  relatedShows?: Show[];
}

// Componente para YouTube Embed
function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return (
      <Box
        sx={{
          textAlign: "center",
          p: 4,
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {url.includes("youtube.com/results") ? (
            <>Video no disponible directamente. Busca en YouTube.</>
          ) : (
            <>Video no disponible</>
          )}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        paddingBottom: "56.25%", // 16:9 aspect ratio
        height: 0,
        overflow: "hidden",
        borderRadius: 2,
        mb: 3,
      }}
    >
      <iframe
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </Box>
  );
}

// Componente para metadata del show
function ShowMetadata({ show }: { show: Show }) {
  const t = useTranslations("shows");
  const locale = useLocale();

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("date")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {formatShowDate(show.date, locale)}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("venue")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {show.venue}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("location")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {show.city}, {show.country}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("era")}
            </Typography>
            <Link
              href={`/formaciones/${show.linkEra}`}
              style={{ textDecoration: "none" }}
            >
              <Chip
                label={show.era}
                variant="outlined"
                sx={{ mb: 2, fontWeight: 500 }}
              />
            </Link>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ mt: 2 }}
            >
              {t("whyHistoric")}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {getShowHistoricDescription(show, locale)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Componente para el setlist
function Setlist({ songs }: { songs: string[] }) {
  const t = useTranslations("shows");

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <MusicNote color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t("setlist")}
          </Typography>
        </Box>

        <List sx={{ pt: 0 }}>
          {songs.map((song, index) => (
            <ListItem
              key={index}
              sx={{
                py: 1,
                px: 2,
                borderLeft: "3px solid",
                borderColor: "primary.main",
                mb: 1,
                backgroundColor: "action.hover",
                borderRadius: 1,
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 600,
                        color: "primary.main",
                        minWidth: 30,
                      }}
                    >
                      {index + 1}.
                    </Typography>
                    <Link
                      href={`/songs/${song
                        .toLowerCase()
                        .replace(/[^a-z0-9 ]/gi, "")
                        .replace(/ /g, "-")}`}
                      passHref
                      legacyBehavior
                    >
                      <Typography
                        component="a"
                        sx={{
                          fontWeight: 500,
                          cursor: "pointer",
                          textDecoration: "none",
                          color: "text.primary",
                          transition: "color 0.2s",
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                      >
                        {song}
                      </Typography>
                    </Link>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default function ShowDetailPage({
  show,
  relatedShows,
}: ShowDetailPageProps) {
  const t = useTranslations("shows");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();
  const { currentEra } = useEra();

  const title = `${show.venue} - ${show.city}`;

  // Si no se pasan shows relacionados (fallback), mostrar vacío o calcular deterministicamente
  // Para evitar errores de hidratación, es mejor recibirlos como prop desde getStaticProps
  const finalRelatedShows = relatedShows || [];

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
          pb={{ xs: 4, md: 6 }}
          maxWidth="1440px"
          mx="auto"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Breadcrumb
            items={[{ label: tb("shows"), href: "/shows" }, { label: title }]}
          />

          {/* Header del show */}
          <Box sx={{ textAlign: "center", mb: 4, mt: 2 }}>
            <Chip
              label={show.era}
              color="primary"
              variant="filled"
              sx={{ mb: 2 }}
            />

            <Typography
              variant="h1"
              sx={{
                fontFamily: "var(--font-heading)",
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 2,
                fontWeight: 600,
                color: currentEra.colors.heroText || "#FFFFFF",
                textShadow: `2px 2px 8px ${currentEra.shadowColor}, 0 0 20px ${currentEra.shadowColor}`,
                transition: "color 0.5s ease, text-shadow 0.5s ease",
              }}
            >
              {show.venue}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.5,
                fontSize: { xs: "18px", md: "22px" },
                color: "text.secondary",
              }}
            >
              {show.city}, {show.country}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 1,
                fontSize: { xs: "16px", md: "18px" },
                color: "text.secondary",
              }}
            >
              {formatShowDate(show.date, locale)}
            </Typography>
          </Box>

          {/* Imagen de portada */}
          {show.image && (
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 300, sm: 400, md: 500 },
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              >
                <Image
                  src={show.image}
                  alt={`${show.venue} - ${show.city}`}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>
            </Box>
          )}

          {/* 
        {/* Metadata del show */}
          <ShowMetadata show={show} />

          {/* Video del show */}
          <Box sx={{ mb: 4 }}>
            <YouTubeEmbed url={show.youtube} title={title} />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                startIcon={<Launch />}
                href={show.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                {show.youtube.includes("youtube.com/results")
                  ? t("searchOnYouTube")
                  : t("watchOnYouTube")}
              </Button>

              {show.setlistUrl && (
                <Button
                  variant="outlined"
                  startIcon={<Launch />}
                  href={show.setlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("viewOnSetlistFm")}
                </Button>
              )}
            </Box>
          </Box>

          {/* Setlist */}
          <Setlist songs={show.setlist} />

          {/* Shows relacionados de la misma era */}
          {finalRelatedShows.length > 0 && (
            <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, mb: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                {t("otherShowsFromEra") || "Otros shows de la misma era"}
              </Typography>
              <Grid container spacing={2}>
                {finalRelatedShows.map((relatedShow) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={relatedShow.id}>
                    <Link
                      href={`/shows/${relatedShow.id}`}
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
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease",
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
                            paddingTop: "56.25%",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={relatedShow.image}
                            alt={`${relatedShow.venue} - ${relatedShow.city}`}
                            fill
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
                            {relatedShow.venue}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              mb: 0.5,
                              fontSize: { xs: "0.75rem", md: "0.8rem" },
                            }}
                          >
                            {relatedShow.city}, {relatedShow.country}
                          </Typography>
                          <Chip
                            label={formatShowDate(relatedShow.date, locale)}
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

          {/* Botón de vuelta */}
          <Box sx={{ mt: 6, textAlign: "center", mb: 4 }}>
            <Button
              component={Link}
              href="/shows"
              variant="contained"
              size="large"
            >
              {t("backToShows")}
            </Button>
          </Box>
          <Box my={4}>
            <RandomSectionBanner currentSection="shows" />
          </Box>
          <CommentsSection
            pageType="article"
            pageId={show.id}
            title={show.venue + " - " + show.city + ", " + show.country}
          />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
