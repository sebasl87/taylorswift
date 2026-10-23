import { getTranslations, getLocale } from "next-intl/server";
import NoticiasClient from "./NoticiasClient";
import { i18nAlternates } from "@/utils/i18nAlternates";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "news" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("pageTitle"),
      description: t("pageDescription"),
    },
    alternates: i18nAlternates("/noticias", locale),
  };
}

export default function NoticiasPage() {
  return <NoticiasClient />;
}
