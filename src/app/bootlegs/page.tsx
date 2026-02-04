import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import BootlegsListPage from "@/components/BootlegsListPage";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("bootlegs");

  const title = `${t("listTitle")} | Taylor Swift`;
  const description = t("listDescription");
  const keywords = [
    "Taylor Swift",
    "bootlegs",
    "conciertos",
    "concerts",
    "live",
    "en vivo",
    "pop",
    "music",
    "recordings",
    "grabaciones",
    "YouTube",
    "unofficial",
    "no oficial",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: "/bootlegs",
      siteName: "Taylor Swift Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/bootlegs/og-bootlegs.jpg",
          width: 1200,
          height: 630,
          alt: locale === "es" ? "Bootlegs de Taylor Swift" : "Taylor Swift Bootlegs",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/bootlegs/og-bootlegs.jpg"],
    },
    alternates: {
      canonical: "/bootlegs",
      languages: {
        es: "/bootlegs",
        en: "/bootlegs",
      },
    },
  };
}

export default function BootlegsPage() {
  return <BootlegsListPage />;
}
