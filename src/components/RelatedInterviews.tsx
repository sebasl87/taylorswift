"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEra } from "@/context/EraContext";
import {
  Interview,
  generateInterviewSlug,
  getInterviewTitle,
} from "@/types/interview";
import { getYouTubeVideoId } from "@/types/show";

// Bloque de interlinking contextual hacia /entrevistas/[slug]: cards con
// <a href> real (no onClick) para que Google descubra las entrevistas desde
// páginas de contenido, no solo desde el header/footer.
export default function RelatedInterviews({
  interviews,
  heading,
}: {
  interviews: Interview[];
  heading: string;
}) {
  const locale = useLocale();
  const t = useTranslations("interviews");
  const { currentEra } = useEra();

  if (interviews.length === 0) return null;

  return (
    <Box component="section" sx={{ maxWidth: 1440, mx: "auto", my: 6 }}>
      <Typography
        component="h2"
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: currentEra.colors.heroText || "inherit",
        }}
      >
        {heading}
      </Typography>
      <Grid container spacing={2}>
        {interviews.map((interview) => {
          const title = getInterviewTitle(interview, locale);
          const videoId = interview.youtube_url
            ? getYouTubeVideoId(interview.youtube_url)
            : null;
          const imageUrl = videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : interview.content?.cover_image;

          return (
            <Grid
              key={interview.id}
              size={{ xs: 12, sm: 6, md: 3 }}
              sx={{ minWidth: 0 }}
            >
              <Card sx={{ height: "100%" }}>
                <CardActionArea
                  component={Link}
                  href={`/entrevistas/${generateInterviewSlug(interview.id)}`}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                  }}
                >
                  {imageUrl && (
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 160,
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 599px) 100vw, (max-width: 899px) 50vw, 25vw"
                        style={{ objectFit: videoId ? "cover" : "contain" }}
                      />
                      <Chip
                        label={new Date(interview.date).getUTCFullYear()}
                        size="small"
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  )}
                  <CardContent>
                    <Typography
                      variant="body1"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        minHeight: "2.6em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {interview.media.name} ·{" "}
                      {interview.type === "video" ? t("video") : t("text")}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
