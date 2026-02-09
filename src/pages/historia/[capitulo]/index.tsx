import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import { useLocale, useTranslations } from "next-intl";
import { Box } from "@mui/material";
import HistoryChapterComponent from "@/components/HistoryChapter";
import HistoryNavigation from "@/components/HistoryNavigation";
import historiaData from "@/constants/historia.json";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Breadcrumb from "@/components/Breadcrumb";
import {
  HistoryData,
  HistoryChapter,
  findChapterBySlug,
  getNextChapter,
  getPreviousChapter,
  getText,
} from "@/types/historia";

interface PageProps {
  chapter: HistoryChapter;
  previousChapter?: HistoryChapter;
  nextChapter?: HistoryChapter;
  allChapters: HistoryChapter[];
}

export default function CapituloPage({
  chapter,
  previousChapter,
  nextChapter,
  allChapters,
}: PageProps) {
  const locale = useLocale() as "es" | "en";
  const t = useTranslations("chapterPage");
  const tb = useTranslations("breadcrumb");

  const chapterTitle = getText(chapter.title, locale);
  const chapterSummary = getText(chapter.summary, locale);

  // SEO Keywords
  const keywords = [
    `Taylor Swift ${chapterTitle}`,
    `Historia ${chapter.period}`,
    "Taylor Swift",
    "Pop",
    "Country",
    chapterTitle.toLowerCase(),
    ...chapter.sections.flatMap((section) =>
      section.title ? [getText(section.title, locale)] : []
    ),
  ];

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
    keywords: keywords.join(", "),
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
      <Head>
        <title>{`${chapterTitle} (${chapter.period}) | Taylor Swift`}</title>
        <meta name="description" content={chapterSummary} />
        <meta name="keywords" content={keywords.join(", ")} />
        <meta property="og:title" content={`${chapterTitle} | Taylor Swift`} />
        <meta property="og:description" content={chapterSummary} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={
            chapter.coverImage?.src || "/images/historia/eras-default-chapter.jpg"
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${chapterTitle} | Taylor Swift`} />
        <meta name="twitter:description" content={chapterSummary} />
        <meta
          name="twitter:image"
          content={
            chapter.coverImage?.src || "/images/historia/eras-default-chapter.jpg"
          }
        />
        <link rel="canonical" href={`/historia/${chapter.slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb
            items={[
              { label: tb("history"), href: "/historia" },
              { label: chapterTitle },
            ]}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          width={"100%"}
        >
          <Box
            maxWidth="1392px"
            sx={{ py: 4, pb: 10, mb: "600px" }}
            width="100%"
          >
            <HistoryChapterComponent chapter={chapter} />
          </Box>
        </Box>
      </ContainerGradientNoPadding>

      <HistoryNavigation
        currentChapter={chapter}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        allChapters={allChapters}
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = historiaData as HistoryData;
  const locales = ["en", "es"];
  const paths: { params: { capitulo: string }; locale: string }[] = [];

  data.chapters.forEach((chapter) => {
    locales.forEach((locale) => {
      paths.push({ params: { capitulo: chapter.slug }, locale });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const capitulo = params?.capitulo as string;
  const data = historiaData as HistoryData;
  const chapter = findChapterBySlug(data.chapters, capitulo);

  if (!chapter) {
    return {
      notFound: true,
    };
  }

  const previousChapter = getPreviousChapter(data.chapters, capitulo);
  const nextChapter = getNextChapter(data.chapters, capitulo);

  return {
    props: {
      chapter,
      previousChapter: previousChapter || null,
      nextChapter: nextChapter || null,
      allChapters: data.chapters,
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
};
