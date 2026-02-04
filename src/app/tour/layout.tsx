import { getLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const keywordsByLocale = {
    es: [
      "Taylor Swift tour",
      "conciertos Taylor Swift",
      "entradas Taylor Swift",
      "The Eras Tour",
      "gira 2026",
      "Taylor Swift concierto",
      "tour fechas",
      "pop en vivo",
      "music tour",
    ],
    en: [
      "Taylor Swift tour",
      "Taylor Swift concerts",
      "Taylor Swift tickets",
      "The Eras Tour",
      "tour 2026",
      "Taylor Swift concert",
      "tour dates",
      "live pop",
      "music tour",
    ],
  };

  const titleByLocale = {
    es: "Taylor Swift Tour 2026 - Fechas y Entradas",
    en: "Taylor Swift Tour 2026 - Dates and Tickets",
  };

  const descriptionByLocale = {
    es: "Fechas oficiales del tour de Taylor Swift 2026. Encuentra entradas para The Eras Tour.",
    en: "Official Taylor Swift 2026 tour dates. Find tickets for The Eras Tour.",
  };

  return {
    title:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description:
      descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
      descriptionByLocale.es,
    keywords:
      keywordsByLocale[locale as keyof typeof keywordsByLocale] ||
      keywordsByLocale.es,
    authors: [{ name: "Taylor Swift Fan Site" }],
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      siteName: "Taylor Swift Fan",
      type: "website",
      locale: locale === "es" ? "es_AR" : "en_US",
      images: [
        {
          url: "/images/taylor-tour.jpg",
          width: 1200,
          height: 630,
          alt: "Taylor Swift Tour 2026",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: "/tour",
    },
  };
}

export default function TourLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
