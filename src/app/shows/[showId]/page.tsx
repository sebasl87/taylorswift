import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import ShowDetailPage from "@/components/ShowDetailPage";
import showsData from "@/constants/shows.json";
import { Show } from "@/types/show";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

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
}) {
  const { showId } = await params;
  const locale = await getLocale();
  const show = getShowById(showId);
  if (!show) return {};

  const t = await getTranslations({ locale, namespace: "shows" });
  const title = `${show.date} - ${show.city} | Taylor Swift`;

  return {
    title,
    description: `${t("showIn")} ${show.city}, ${show.country} - ${show.venue}`,
    openGraph: {
      title,
      description: `${t("showIn")} ${show.city}, ${show.country} - ${show.venue}`,
      type: "article",
    },
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

  return (
    <ContainerGradientNoPadding>
      <ShowDetailPage show={show} />
    </ContainerGradientNoPadding>
  );
}
