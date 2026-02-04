import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "es"
    ? "Política de privacidad | Taylor Swift Fan Site"
    : "Privacy Policy | Taylor Swift Fan Site";
  const description = locale === "es"
    ? "Lee la política de privacidad del sitio de fans de Taylor Swift. Protección de datos y derechos de los usuarios."
    : "Read the privacy policy for the Taylor Swift fan site. Data protection and user rights.";
  const keywords = locale === "es"
    ? ["Taylor Swift", "privacidad", "política", "datos", "fan site", "usuarios"]
    : ["Taylor Swift", "privacy", "policy", "data", "fan site", "users"];
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
          alt: "Taylor Swift Privacidad",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: "/privacidad",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}
