"use client";

import { Box, Typography, Chip, Divider } from "@mui/material";
import { HistoryChapter, HistorySection, getText } from "@/types/historia";
import HistoryImageComponent from "./HistoryImage";
import { useTheme } from "@mui/material/styles";
import { useLocale } from "next-intl";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import { useEra } from "@/context/EraContext";
import Breadcrumb from "./Breadcrumb";

interface HistoryChapterComponentProps {
  chapter: HistoryChapter;
}

interface HistorySectionComponentProps {
  section: HistorySection;
  chapterColor: string;
}

function HistorySectionComponent({
  section,
  chapterColor,
}: HistorySectionComponentProps) {
  const theme = useTheme();
  const locale = useLocale() as "es" | "en";
  const { currentEra } = useEra();

  const sectionContent = getText(section.content, locale);
  const sectionTitle = section.title
    ? getText(section.title, locale)
    : undefined;

  const renderTextWithImages = () => {
    const paragraphs = sectionContent.split("\n\n");

    return (
      <Box>
        {paragraphs.map((paragraph: string, index: number) => (
          <Typography
            key={index}
            variant="body1"
            paragraph
            sx={{
              lineHeight: 1.8,
              fontSize: "1.1rem",
              color: currentEra.colors.heroText,
              textAlign: "justify",
              mb: 2,
            }}
          >
            {paragraph}
          </Typography>
        ))}

        {/* Imágenes flotantes */}
        {section.images?.map((image, imageIndex) => (
          <HistoryImageComponent
            key={imageIndex}
            image={image}
            priority={imageIndex === 0}
          />
        ))}
      </Box>
    );
  };

  const renderImageGallery = () => (
    <Box>
      <Typography
        variant="body1"
        paragraph
        sx={{
          lineHeight: 1.8,
          fontSize: "1.1rem",
          color: currentEra.colors.heroText,
          textAlign: "justify",
          mb: 4,
        }}
      >
        {sectionContent}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
          mt: 2,
        }}
      >
        {section.images?.map((image, imageIndex) => (
          <Box key={imageIndex}>
            <HistoryImageComponent
              image={{
                ...image,
                layout: "gallery",
                size: "medium",
              }}
              priority={imageIndex === 0}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderParallaxSection = () => (
    <Box sx={{ my: 4 }}>
      {section.images?.[0] && (
        <HistoryImageComponent
          image={{
            ...section.images[0],
            position: "background",
            layout: "parallax",
          }}
          priority
        />
      )}

      <Box sx={{ mt: 3 }}>
        <Typography
          variant="body1"
          paragraph
          sx={{
            lineHeight: 1.8,
            fontSize: "1.1rem",
            color: currentEra.colors.heroText,
            textAlign: "justify",
          }}
        >
          {sectionContent}
        </Typography>
      </Box>
    </Box>
  );

  const renderTextOnly = () => (
    <Typography
      variant="body1"
      paragraph
      sx={{
        lineHeight: 1.8,
        fontSize: "1.1rem",
        color: currentEra.colors.heroText,
        textAlign: "justify",
        mb: 3,
      }}
    >
      {sectionContent}
    </Typography>
  );

  return (
    <Box sx={{ mb: 4 }}>
      {/* Título de la sección */}
      {section.title && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: currentEra.colors.heroText,
              mb: 1,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            {sectionTitle}
          </Typography>
          <Divider
            sx={{
              width: "60px",
              height: "3px",
              backgroundColor: currentEra.colors.primary,
              mb: 2,
            }}
          />
        </Box>
      )}

      {/* Contenido según el layout */}
      {section.layout === "image-gallery" && renderImageGallery()}
      {section.layout === "parallax" && renderParallaxSection()}
      {section.layout === "text-only" && renderTextOnly()}
      {(section.layout === "text-with-images" || !section.layout) &&
        renderTextWithImages()}
    </Box>
  );
}

export default function HistoryChapterComponent({
  chapter,
}: HistoryChapterComponentProps) {
  const theme = useTheme();
  const locale = useLocale() as "es" | "en";
  const { currentEra } = useEra();
  const chapterColor = chapter.color || theme.palette.primary.main;

  const chapterTitle = getText(chapter.title, locale);
  const chapterSubtitle = chapter.subtitle
    ? getText(chapter.subtitle, locale)
    : undefined;
  const chapterSummary = getText(chapter.summary, locale);

  return (
    <ContainerGradientNoPadding>
      <Box
        sx={{
          background: currentEra.colors.heroOverlay,
          minHeight: "100vh",
          position: "relative",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Box width="100%" pt="100px" maxWidth={1440}>
          <Box px={{ xs: 2, md: 0 }} pb={{ xs: 2, md: 4 }}>
            <Breadcrumb
              items={[
                {
                  label: locale === "es" ? "Historia" : "History",
                  href: "/era",
                },
                { label: chapterTitle },
              ]}
            />
          </Box>
          {/* Header del capítulo */}
          <Box
            sx={{
              position: "relative",
              mb: 4,
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            {/* Imagen de fondo del capítulo */}
            {chapter.coverImage && (
              <HistoryImageComponent image={chapter.coverImage} priority />
            )}

            {/* Overlay con información del capítulo */}
            <Box
              sx={{
                position: chapter.coverImage ? "absolute" : "relative",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",

                color: chapter.coverImage
                  ? "white"
                  : theme.palette.text.primary,
                textAlign: "center",
                padding: 6,
                minHeight: "400px",
              }}
            >
              {/* Chip con período */}
              <Chip
                label={chapter.period}
                sx={{
                  backgroundColor: chapterColor,
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  mb: 2,
                  px: 2,
                  py: 0.5,
                }}
              />

              {/* Título */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  mb: 1,
                  textShadow: chapter.coverImage
                    ? "2px 2px 4px rgba(0,0,0,0.8)"
                    : "none",
                  lineHeight: 1.1,
                }}
              >
                {chapterTitle}
              </Typography>

              {/* Subtítulo */}
              {chapter.subtitle && (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "1.2rem", md: "1.8rem" },
                    mb: 3,
                    fontStyle: "italic",
                    textShadow: chapter.coverImage
                      ? "1px 1px 2px rgba(0,0,0,0.8)"
                      : "none",
                    opacity: 0.9,
                  }}
                >
                  {chapterSubtitle}
                </Typography>
              )}

              {/* Resumen */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  maxWidth: "800px",
                  lineHeight: 1.6,
                  textShadow: chapter.coverImage
                    ? "1px 1px 2px rgba(0,0,0,0.8)"
                    : "none",
                }}
              >
                {chapterSummary}
              </Typography>
            </Box>
          </Box>

          {/* Contenido de las secciones */}
          <Box sx={{ maxWidth: "1392px", mx: "auto", px: { xs: 2, md: 4 } }}>
            {chapter.sections.map((section) => (
              <HistorySectionComponent
                key={section.id}
                section={section}
                chapterColor={chapterColor}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
