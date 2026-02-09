import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import HistoriaClient from "./HistoriaClient";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
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
    alternates: {
      canonical: "/historia",
    },
  };
}

export default function HistoriaPage() {
  return (
    <ContainerGradientNoPadding>
      <HistoriaClient />
    </ContainerGradientNoPadding>
  );
}
