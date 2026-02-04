import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "es"
    ? "Preguntas frecuentes | Taylor Swift Fan Site"
    : "Frequently Asked Questions | Taylor Swift Fan Site";
  const description = locale === "es"
    ? "Respuestas a las preguntas más comunes sobre el fan site de Taylor Swift, legalidad, contacto y uso."
    : "Answers to the most common questions about the Taylor Swift fan site, legality, contact and usage.";
  const keywords = locale === "es"
    ? ["Taylor Swift", "FAQ", "preguntas frecuentes", "fan site", "contacto", "legal", "privacidad", "términos"]
    : ["Taylor Swift", "FAQ", "frequently asked questions", "fan site", "contact", "legal", "privacy", "terms"];
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName: "Taylor Swift Fan Site",
      type: "website",
      locale: locale === "es" ? "es_AR" : "en_US",
      images: [
        {
          url: "/images/placeholder.jpg",
          width: 1200,
          height: 630,
          alt: "Megadeth FAQ",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: "/faq",
    },
  };
}
