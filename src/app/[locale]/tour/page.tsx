import { getLocale } from "next-intl/server";
import TourPageClient from "./TourPageClient";
import { i18nAlternates } from "@/utils/i18nAlternates";
import { absoluteUrl } from "@/utils/absoluteUrl";
import type { Metadata } from "next";

const tourMeta = {
  es: {
    title: "Giras de Taylor Swift: The Eras Tour, fechas y setlists",
    description:
      "Todas las giras de Taylor Swift, de Fearless Tour a The Eras Tour: fechas, ciudades, setlists y próximos shows. Historial completo de conciertos.",
  },
  en: {
    title: "Taylor Swift Tours: The Eras Tour, Dates & Setlists",
    description:
      "Every Taylor Swift tour, from the Fearless Tour to The Eras Tour: dates, cities, setlists and upcoming shows. Complete concert history.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = locale === "es" ? tourMeta.es : tourMeta.en;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: absoluteUrl("/tour", locale),
    },
    alternates: i18nAlternates("/tour", locale),
  };
}

export default function TourPage() {
  return <TourPageClient />;
}
