import { getTranslations, getLocale } from "next-intl/server";
import { Metadata } from "next";
import DiscographyClient from "./DiscographyClient";
import discographyData from "@/constants/discography.json";
import { Album } from "@/types/album";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "discography" });
  return {
    title: `${t("title")} | Taylor Swift`,
    description: t("description"),
    openGraph: {
      title: `${t("title")} | Taylor Swift`,
      description: t("description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | Taylor Swift`,
      description: t("description"),
    },
    alternates: {
      canonical: "/discography",
    },
  };
}

export default function DiscographyPage() {
  const studioAlbums = discographyData as unknown as Album[];
  return <DiscographyClient albums={studioAlbums} />;
}
