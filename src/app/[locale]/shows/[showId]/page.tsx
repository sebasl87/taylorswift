import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import ShowDetailPage from "@/components/ShowDetailPage";
import showsData from "@/constants/shows.json";
import { Show } from "@/types/show";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import { i18nAlternates } from "@/utils/i18nAlternates";
import { absoluteUrl } from "@/utils/absoluteUrl";
import type { Metadata } from "next";

function getShowById(id: string): Show | undefined {
  return (showsData as Show[]).find((show) => show.id === id);
}

export async function generateStaticParams() {
  const shows = showsData as Show[];
  return shows.map((show) => ({
    showId: show.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ showId: string }>;
}): Promise<Metadata> {
  const { showId } = await params;
  const locale = await getLocale();
  const show = getShowById(showId);
  if (!show) return {};

  const year = show.date.slice(0, 4);
  const title =
    locale === "es"
      ? `Taylor Swift en ${show.venue}, ${show.city} (${year}): setlist`
      : `Taylor Swift at ${show.venue}, ${show.city} (${year}): Setlist`;
  const description =
    locale === "es"
      ? `Taylor Swift en vivo en ${show.venue}, ${show.city} (${show.country}), ${show.date}: setlist completo, contexto e historia del show.`
      : `Taylor Swift live at ${show.venue}, ${show.city} (${show.country}), ${show.date}: full setlist, context and history of the show.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/shows/${showId}`, locale),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: i18nAlternates(`/shows/${showId}`, locale),
  };
}

export default async function ShowPage({
  params,
}: {
  params: Promise<{ showId: string }>;
}) {
  const { showId } = await params;
  const show = getShowById(showId);

  if (!show) {
    notFound();
  }

  return <ShowDetailPage show={show} />;
}
