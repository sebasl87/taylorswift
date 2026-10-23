import { getLocale } from "next-intl/server";
import HistoryChapterComponent from "@/components/HistoryChapter";
import historiaData from "@/constants/historia.json";
import HistoryNavigation from "@/components/HistoryNavigation";
import {
  HistoryData,
  findChapterBySlug,
  getNextChapter,
  getPreviousChapter,
  getText,
} from "@/types/historia";
import { notFound } from "next/navigation";
import { Box } from "@mui/material";
import interviewsData from "@/constants/interviews.json";
import { Interview } from "@/types/interview";
import RelatedInterviews from "@/components/RelatedInterviews";
import { i18nAlternates } from "@/utils/i18nAlternates";
import { absoluteUrl } from "@/utils/absoluteUrl";

// Entrevistas cuyo año cae dentro del rango del capítulo. El primer y el
// último capítulo quedan abiertos hacia afuera, para no perder entrevistas
// previas al debut ni posteriores a la fecha de cierre de historia.json.
// getUTCFullYear(): las fechas "YYYY-01-01" son medianoche UTC, en zonas
// UTC-negativas getFullYear() devolvería el año anterior.
function getRelatedInterviews(
  chapter: HistoryData["chapters"][number],
  allChapters: HistoryData["chapters"],
): Interview[] {
  const isFirstChapter =
    chapter.yearStart === Math.min(...allChapters.map((c) => c.yearStart));
  const isLatestChapter =
    chapter.yearEnd === Math.max(...allChapters.map((c) => c.yearEnd));

  return (interviewsData as Interview[]).filter((interview) => {
    const year = new Date(interview.date).getUTCFullYear();
    return (
      (isFirstChapter || year >= chapter.yearStart) &&
      (isLatestChapter || year <= chapter.yearEnd)
    );
  });
}

// Generate static params for all chapters
export async function generateStaticParams() {
  const data = historiaData as HistoryData;
  return data.chapters.map((chapter) => ({
    capitulo: chapter.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ capitulo: string }>;
}) {
  const { capitulo } = await params;
  const locale = await getLocale();

  const data = historiaData as HistoryData;
  const chapter = findChapterBySlug(data.chapters, capitulo);
  if (!chapter) return {};

  const chapterTitle = getText(chapter.title, locale as "es" | "en");
  const chapterSummary = getText(chapter.summary, locale as "es" | "en");

  return {
    title: `${chapterTitle} (${chapter.period}) | Taylor Swift`,
    description: chapterSummary,
    keywords: [
      `Taylor Swift ${chapterTitle}`,
      locale === "es" ? `Historia ${chapter.period}` : `History ${chapter.period}`,
      "Taylor Swift",
      "Pop",
      "Country",
      chapterTitle.toLowerCase(),
      ...chapter.sections.flatMap((section) =>
        section.title ? [getText(section.title, locale as "es" | "en")] : [],
      ),
    ],
    openGraph: {
      title: `${chapterTitle} (${chapter.period}) | Taylor Swift`,
      description: chapterSummary,
      type: "article",
      images: [
        chapter.coverImage?.src || "/images/historia/eras-default-chapter.jpg",
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${chapterTitle} (${chapter.period}) | Taylor Swift`,
      description: chapterSummary,
      images: [
        chapter.coverImage?.src || "/images/historia/eras-default-chapter.jpg",
      ],
    },
    alternates: i18nAlternates(`/era/${capitulo}`, locale),
  };
}

export default async function CapituloPage({
  params,
}: {
  params: Promise<{ capitulo: string }>;
}) {
  const { capitulo } = await params;
  const locale = await getLocale();

  const data = historiaData as HistoryData;
  const chapter = findChapterBySlug(data.chapters, capitulo);

  if (!chapter) {
    notFound();
  }

  const previousChapter = getPreviousChapter(data.chapters, capitulo);
  const nextChapter = getNextChapter(data.chapters, capitulo);
  const allChapters = data.chapters;

  const chapterTitle = getText(chapter.title, locale as "es" | "en");
  const chapterSummary = getText(chapter.summary, locale as "es" | "en");

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${chapterTitle} (${chapter.period})`,
    description: chapterSummary,
    image: `https://taylorswift.com.ar${
      chapter.coverImage?.src || "/images/historia/eras-default-chapter.jpg"
    }`,
    url: absoluteUrl(`/era/${capitulo}`, locale),
    inLanguage: locale,
    // Autor/publisher = este fan site, no la artista (el contenido no es
    // oficial; atribuírselo a Taylor Swift sería engañoso).
    author: {
      "@type": "Organization",
      name: "Taylor Swift Fan Site",
      url: "https://taylorswift.com.ar",
    },
    publisher: {
      "@type": "Organization",
      name: "Taylor Swift Fan Site",
      logo: {
        "@type": "ImageObject",
        url: "https://taylorswift.com.ar/icon.webp",
      },
    },
    datePublished: "2025-01-01T00:00:00.000Z",
    dateModified: "2025-01-01T00:00:00.000Z",
    articleSection: locale === "es" ? "Historia" : "History",
    about: {
      "@type": "MusicGroup",
      name: "Taylor Swift",
      genre: "Pop / Country / Folk",
      foundingDate: "2006",
      description:
        locale === "es"
          ? "Cantautora estadounidense conocida por su narrativa musical"
          : "American singer-songwriter known for her narrative songwriting",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HistoryChapterComponent chapter={chapter} />

      {/* Entrevistas de esta era — interlinking automático por año */}
      <Box px={{ xs: 2, md: 4 }}>
        <RelatedInterviews
          interviews={getRelatedInterviews(chapter, data.chapters)}
          heading={
            locale === "es"
              ? "Entrevistas de esta era"
              : "Interviews from this era"
          }
        />
      </Box>

      <HistoryNavigation
        currentChapter={chapter}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        allChapters={allChapters}
      />
    </>
  );
}
