import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import TerminosPageContent from "./TerminosPageContent";
import { i18nAlternates } from "@/utils/i18nAlternates";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "terms" });

  const title = t("title");

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
    alternates: i18nAlternates("/terminos", locale),
  };
}

export default function TermsPage() {
  return <TerminosPageContent />;
}