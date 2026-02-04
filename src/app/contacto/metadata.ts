import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "es"
    ? "Contacto | Taylor Swift Fan Site"
    : "Contact | Taylor Swift Fan Site";
  const description = locale === "es"
    ? "Formulario de contacto para el sitio de fans de Taylor Swift. Envía tus dudas, sugerencias o comentarios."
    : "Contact form for the Taylor Swift fan site. Send your questions, suggestions or comments.";
  const keywords = locale === "es"
    ? ["Taylor Swift", "contacto", "fan site", "formulario", "dudas", "sugerencias", "comentarios"]
    : ["Taylor Swift", "contact", "fan site", "form", "questions", "suggestions", "comments"];
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
          alt: "Taylor Swift Contacto",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: "/contacto",
    },
  };
}
