import { getTranslations, getLocale } from "next-intl/server";
import HistoriaClient from "./HistoriaClient";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import { i18nAlternates } from "@/utils/i18nAlternates";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "historyPage" });

  return {
    title: `${t("title")} | Taylor Swift`,
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: `${t("title")} | Taylor Swift`,
      description: t("description"),
      type: "article",
      images: ["/images/historia/eras-timeline-hero.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | Taylor Swift`,
      description: t("description"),
      images: ["/images/historia/eras-timeline-hero.jpg"],
    },
    alternates: i18nAlternates("/era", locale),
  };
}

export default function HistoriaPage() {
  return (
    <ContainerGradientNoPadding>
      <HistoriaClient />
    </ContainerGradientNoPadding>
  );
}
