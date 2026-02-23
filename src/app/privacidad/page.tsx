import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import PrivacidadPageContent from "./PrivacidadPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "privacy" });

  const title = t("title");

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: "/privacidad",
    },
  };
}

export default function PrivacyPage() {
  return <PrivacidadPageContent />;
}