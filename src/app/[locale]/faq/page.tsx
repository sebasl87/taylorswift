import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import FaqPageContent from "./FaqPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "faq" });

  const title = t("title");
  const description =
    locale === "es"
      ? "Preguntas frecuentes sobre Taylor Swift: discografía, conciertos, letras y más."
      : "Frequently asked questions about Taylor Swift: discography, concerts, lyrics and more.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    alternates: {
      canonical: "/faq",
    },
  };
}

// JSON-LD estructurado (server-side para mejor SEO)
async function FaqJsonLd() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "faq" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("q1"),
        acceptedAnswer: { "@type": "Answer", text: t("a1") },
      },
      {
        "@type": "Question",
        name: t("q2"),
        acceptedAnswer: { "@type": "Answer", text: t("a2") },
      },
      {
        "@type": "Question",
        name: t("q3"),
        acceptedAnswer: { "@type": "Answer", text: t("a3") },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function FAQPage() {
  return (
    <>
      <FaqJsonLd />
      <FaqPageContent />
    </>
  );
}
