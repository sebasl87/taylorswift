import { notFound } from "next/navigation";
import ShowDetailPage from "@/components/ShowDetailPage";
import showsData from "@/constants/shows.json";
import { Show, generateShowSlug, formatShowDate } from "@/types/show";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";

interface ShowPageProps {
  params: Promise<{
    showId: string;
  }>;
}

// Función para encontrar show por slug
function findShowBySlug(slug: string): Show | null {
  const show = (showsData as Show[]).find((s) => {
    return generateShowSlug(s) === slug;
  });
  return show || null;
}

export async function generateStaticParams() {
  return (showsData as Show[]).map((show: Show) => ({
    showId: generateShowSlug(show),
  }));
}

export async function generateMetadata({
  params,
}: ShowPageProps): Promise<Metadata> {
  const { showId } = await params;
  const locale = await getLocale();
  const show = findShowBySlug(showId);

  if (!show) return { title: "Show no encontrado" };

  const title = `${show.venue} - ${show.city}`;
  const description = `${show.whyHistoric}`;
  const date = new Date(show.date);
  const year = date.getFullYear();

  const fullTitle = `${title} (${year}) | Taylor Swift Shows`;
  const keywords = [
    "Taylor Swift",
    show.venue,
    show.city,
    show.country,
    show.era,
    year.toString(),
    "show",
    "concierto",
    "concert",
    "live",
    "en vivo",
    ...show.setlist,
  ];

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      url: `/shows/${showId}`,
      siteName: "Taylor Swift Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "article",
      publishedTime: show.date,
      images: [
        {
          url: show.image || "/images/shows/default-show.jpg",
          width: 1200,
          height: 630,
          alt: `${title} - ${formatShowDate(show.date, locale)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [show.image || "/images/shows/default-show.jpg"],
      creator: "@TaylorSwiftFanSite",
    },
    alternates: {
      canonical: `/shows/${showId}`,
      languages: {
        es: `/shows/${showId}`,
        en: `/shows/${showId}`,
      },
    },
    other: {
      "article:published_time": show.date,
      "article:section": "Shows",
      "article:tag": show.era,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { showId } = await params;
  const show = findShowBySlug(showId);

  if (!show) {
    notFound();
  }

  return <ShowDetailPage show={show} />;
}
