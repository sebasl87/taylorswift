import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ShowsListPage from "@/components/ShowsListPage";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("shows");

  const title = `${t("listTitle")} | Taylor Swift`;
  const description = t("listDescription");
  const keywords = [
    "Taylor Swift",
    "shows",
    "conciertos",
    "concerts",
    "live",
    "en vivo",
    "pop",
    "country",
    "The Eras Tour",
    "historic shows",
    "shows históricos",
    "tour dates",
    "fechas de gira",
    "setlist",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: "/shows",
      siteName: "Taylor Swift Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/shows/og-shows.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "Shows Históricos de Taylor Swift"
              : "Taylor Swift Historic Shows",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/shows/og-shows.jpg"],
      creator: "@TaylorSwiftFanSite",
    },
    alternates: {
      canonical: "/shows",
      languages: {
        es: "/shows",
        en: "/shows",
      },
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

export default function ShowsPage() {
  return <ShowsListPage />;
}
