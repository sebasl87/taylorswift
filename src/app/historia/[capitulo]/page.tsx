import { getTranslations } from "next-intl/server";
import { Box } from "@mui/material";
import HistoryChapterComponent from "@/components/HistoryChapter";
import historiaData from "@/constants/historia.json";
import HistoryNavigation from "@/components/HistoryNavigation";
import {
  HistoryData,
  HistoryChapter,
  findChapterBySlug,
  getNextChapter,
  getPreviousChapter,
  getText,
} from "@/types/historia";
import { notFound } from "next/navigation";

// Generate static params for all chapters
export async function generateStaticParams() {
  const data = historiaData as HistoryData;
  return data.chapters.map((chapter) => ({
    capitulo: chapter.slug,
  }));
}

export async function generateMetadata({
  params: { capitulo, locale },
}: {
  params: { capitulo: string; locale: string };
}) {
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
      `Historia ${chapter.period}`,
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
  };
}

export default async function CapituloPage({
  params: { capitulo, locale },
}: {
  params: { capitulo: string; locale: string };
}) {
  const data = historiaData as HistoryData;
  const chapter = findChapterBySlug(data.chapters, capitulo);

  if (!chapter) {
    notFound();
  }

  const previousChapter = getPreviousChapter(data.chapters, capitulo);
  const nextChapter = getNextChapter(data.chapters, capitulo);
  const allChapters = data.chapters;

  const t = await getTranslations({ locale, namespace: "chapterPage" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });

  const chapterTitle = getText(chapter.title, locale as "es" | "en");
  const chapterSummary = getText(chapter.summary, locale as "es" | "en");

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${chapterTitle} (${chapter.period})`,
    description: chapterSummary,
    image:
      chapter.coverImage?.src || "/images/historia/eras-default-chapter.jpg",
    author: {
      "@type": "Person",
      name: "Taylor Swift",
      url: "https://taylorswift.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Taylor Swift Official",
      logo: {
        "@type": "ImageObject",
        url: "/images/taylor-logo.png",
      },
    },
    datePublished: "2025-01-01T00:00:00.000Z",
    dateModified: "2025-01-01T00:00:00.000Z",
    articleSection: "Historia",
    about: {
      "@type": "MusicGroup",
      name: "Taylor Swift",
      genre: "Pop / Country / Folk",
      foundingDate: "2006",
      description:
        "Cantautora estadounidense conocida por su narrativa musical",
    },
    mainEntity: {
      "@type": "CreativeWork",
      name: `Historia: ${chapter.title}`,
      description: chapter.summary,
      creator: {
        "@type": "Person",
        name: "Taylor Swift",
        jobTitle: "Cantautora",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HistoryChapterComponent chapter={chapter} />
      <HistoryNavigation
        currentChapter={chapter}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        allChapters={allChapters}
      />
    </>
  );
}
