import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "es"
    ? "Términos y condiciones | Taylor Swift Fan Site"
    : "Terms and Conditions | Taylor Swift Fan Site";
  const description = locale === "es"
    ? "Lee los términos y condiciones de uso del sitio de fans de Taylor Swift. Información legal y derechos."
    : "Read the terms and conditions for using the Taylor Swift fan site. Legal information and rights.";
  const keywords = locale === "es"
    ? ["Taylor Swift", "términos", "condiciones", "legal", "fan site", "uso"]
    : ["Taylor Swift", "terms", "conditions", "legal", "fan site", "usage"];
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
          alt: "Taylor Swift Términos",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: "/terminos",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}
