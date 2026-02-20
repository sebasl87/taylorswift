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
  Paper,
} from "@mui/material";
import { Launch } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Interview,
  getInterviewTitle,
  getInterviewDescription,
  InterviewContentItem,
} from "@/types/interview";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "./NewsBanner";
import { CommentsSection } from "./CommentsSection";
import { useEra } from "@/context/EraContext";

interface InterviewDetailPageProps {
  interview: Interview;
}

// Componente para YouTube Embed
function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) return null;

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
        src={embedUrl}
        title={title}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </Box>
  );
}

// Función para procesar texto con markdown básico
function processMarkdownText(text: string) {
  // Dividir el texto por líneas para preservar saltos de línea
  const lines = text.split("\n");

  return lines.map((line, lineIndex) => {
    const parts = [];
    let currentIndex = 0;
    const lineText = line;

    // Buscar patrones de **texto** y *texto*
    const regex = /(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
    let match;

    while ((match = regex.exec(lineText)) !== null) {
      // Agregar texto antes del match
      if (match.index > currentIndex) {
        parts.push(lineText.slice(currentIndex, match.index));
      }

      // Procesar el match
      const matchedText = match[0];
      if (matchedText.startsWith("**") && matchedText.endsWith("**")) {
        // Negrita
        const boldText = matchedText.slice(2, -2);
        parts.push(
          <strong key={`${lineIndex}-${match.index}-bold`}>{boldText}</strong>,
        );
      } else if (matchedText.startsWith("*") && matchedText.endsWith("*")) {
        // Cursiva
        const italicText = matchedText.slice(1, -1);
        parts.push(
          <em key={`${lineIndex}-${match.index}-italic`}>{italicText}</em>,
        );
      }

      currentIndex = match.index + matchedText.length;
    }

    // Agregar texto restante
    if (currentIndex < lineText.length) {
      parts.push(lineText.slice(currentIndex));
    }

    // Si no hay partes, devolver la línea original
    if (parts.length === 0) {
      parts.push(line);
    }

    // Devolver la línea procesada, agregando <br/> excepto en la última línea
    return (
      <span key={lineIndex}>
        {parts}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
}

// Componente para pregunta-respuesta
function QuestionAnswer({ item }: { item: InterviewContentItem }) {
  if (item.type === "qa") {
    return (
      <Box sx={{ mb: 4 }}>
        <Paper
          sx={{
            p: 3,
            background: "#EF5350",
            color: "white",
            mb: 2,
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, mb: 1, opacity: 0.9 }}
          >
            {item.interviewer}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              lineHeight: 1.4,
              fontSize: "16px",
            }}
          >
            {item.question}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 3,
            color: "text.primary",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, mb: 1, opacity: 0.9 }}
          >
            {item.respondent}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            &ldquo;{item.answer}&rdquo;
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (item.type === "intro") {
    return (
      <Paper
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.7,
            textAlign: "justify",
          }}
        >
          {item.text ? processMarkdownText(item.text) : ""}
        </Typography>
      </Paper>
    );
  }

  if (item.type === "monologue") {
    return (
      <Paper
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.7,
            textAlign: "justify",
          }}
        >
          {item.text ? processMarkdownText(item.text) : ""}
        </Typography>
      </Paper>
    );
  }

  return null;
}

// Componente para metadata de la entrevista
function InterviewMetadata({ interview }: { interview: Interview }) {
  const t = useTranslations("interviews");
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("date")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {formatDate(interview.date)}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("media")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {interview.media.name} ({interview.media.country})
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("interviewer")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
              {interview.interviewer.name}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t("interviewees")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {interview.interviewees.map((interviewee, index) => (
                <Chip
                  key={index}
                  label={`${interviewee.name} (${interviewee.role})`}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>

            {interview.type === "video" && interview.duration && (
              <>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {t("duration")}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {interview.duration}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default function InterviewDetailPage({
  interview,
}: InterviewDetailPageProps) {
  const t = useTranslations("interviews");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();

  const title = getInterviewTitle(interview, locale);
  const description = getInterviewDescription(interview, locale);
  const content = interview.content?.[locale as "es" | "en"] || [];
  const { currentEra } = useEra();

  return (
    <ContainerGradientNoPadding>
      <Box
        sx={{
          background: currentEra.colors.heroOverlay,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box pt="100px" px={{ xs: 2, md: 0 }} pb={{ xs: 2, md: 4 }}>
          <Breadcrumb
            items={[
              { label: tb("interviews"), href: "/entrevistas" },
              { label: title },
            ]}
          />
        </Box>
        <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
          {/* Header de la entrevista */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Chip
              label={interview.type === "video" ? t("video") : t("text")}
              color={interview.type === "video" ? "primary" : "secondary"}
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
              {title}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.5,
                fontSize: { xs: "16px", md: "18px" },
              }}
            >
              {description}
            </Typography>
          </Box>

          {/* Imagen de portada */}
          {interview.content?.cover_image && (
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 300, sm: 400, md: 500 },
                  height: { xs: 300, sm: 400, md: 500 },
                  mx: "auto",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={interview.content.cover_image}
                  alt={`Portada de la entrevista: ${title}`}
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </Box>
            </Box>
          )}

          {/* Metadata de la entrevista */}
          <InterviewMetadata interview={interview} />

          {/* Contenido principal */}
          {interview.type === "video" ? (
            // Layout para entrevista en video
            <Box mb={2}>
              {interview.youtube_url && (
                <YouTubeEmbed url={interview.youtube_url} title={title} />
              )}
            </Box>
          ) : (
            // Layout para entrevista de texto con Q&A
            <Box>
              {content.length > 0 ? (
                content.map((item, index) => (
                  <QuestionAnswer key={index} item={item} />
                ))
              ) : (
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    Contenido no disponible
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
          <Box mt={4}>
            <RandomSectionBanner currentSection="interviews" />
          </Box>
          <CommentsSection
            pageType="article"
            pageId={interview.id}
            title={title}
          />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
