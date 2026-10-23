import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import PrivacidadPageContent from "./PrivacidadPageContent";
import { i18nAlternates } from "@/utils/i18nAlternates";

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
    alternates: i18nAlternates("/privacidad", locale),
  };
}

export default function PrivacyPage() {
  return <PrivacidadPageContent />;
}