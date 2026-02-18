"use client";
import {
  Container,
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
import Breadcrumb from "@/components/Breadcrumb";
import {
  Bootleg,
  formatBootlegDate,
  getYouTubeVideoId,
  getBootlegDescription,
  getBootlegYear,
} from "@/types/bootleg";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "./NewsBanner";
import { CommentsSection } from "./CommentsSection";

interface BootlegDetailPageProps {
  bootleg: Bootleg;
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

// Componente para metadata del bootleg
function BootlegMetadata({ bootleg }: { bootleg: Bootleg }) {
  const t = useTranslations("bootlegs");
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
              {formatBootlegDate(bootleg.date, locale)}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("venue")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {bootleg.venue}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("location")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {bootleg.city}, {bootleg.country}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("era")}
            </Typography>
            <Link
              href={`/formaciones/${bootleg.linkEra}`}
              style={{ textDecoration: "none" }}
            >
              <Chip
                label={bootleg.era}
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
              {t("description")}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {getBootlegDescription(bootleg, locale)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Componente para el setlist
function Setlist({ songs }: { songs: string[] }) {
  const t = useTranslations("bootlegs");
  const locale = useLocale();

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

export default function BootlegDetailPage({ bootleg }: BootlegDetailPageProps) {
  const t = useTranslations("bootlegs");
  const tb = useTranslations("breadcrumb");

  const title = `${bootleg.title} - ${bootleg.city}`;

  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 2, md: 4 }}>
        <Breadcrumb
          items={[
            { label: tb("bootlegs"), href: "/bootlegs" },
            { label: title },
          ]}
        />
      </Box>
      <Container maxWidth={false} sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header del bootleg */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Chip
            label={bootleg.era}
            color="primary"
            variant="filled"
            sx={{ mb: 2 }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              mb: 2,
              fontWeight: 600,
            }}
          >
            {bootleg.title}
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
            {bootleg.venue}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mt: 1,
              fontSize: { xs: "16px", md: "18px" },
              color: "text.secondary",
            }}
          >
            {bootleg.city}, {bootleg.country} • {getBootlegYear(bootleg)}
          </Typography>
        </Box>

        {/* Imagen de portada */}
        {bootleg.image && (
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
                src={bootleg.image}
                alt={bootleg.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
          </Box>
        )}

        {/* Metadata del bootleg */}
        <BootlegMetadata bootleg={bootleg} />

        {/* Video del bootleg */}
        <Box sx={{ mb: 4 }}>
          <YouTubeEmbed url={bootleg.youtube} title={bootleg.title} />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              startIcon={<Launch />}
              href={bootleg.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              {bootleg.youtube.includes("youtube.com/results")
                ? t("searchOnYouTube")
                : t("watchOnYouTube")}
            </Button>
          </Box>
        </Box>

        {/* Setlist */}
        <Setlist songs={bootleg.setlist} />

        {/* Botón de vuelta */}
        <Box sx={{ mt: 6, textAlign: "center", mb: 4 }}>
          <Button
            component={Link}
            href="/bootlegs"
            variant="contained"
            size="large"
          >
            {t("backToBootlegs")}
          </Button>
        </Box>
        <Box mb={4}>
          <RandomSectionBanner currentSection="bootlegs" />
        </Box>
        <CommentsSection
          pageType="article"
          pageId={bootleg.id}
          title={bootleg.title}
        />
      </Container>
    </ContainerGradientNoPadding>
  );
}
