import { getTranslations, getLocale } from "next-intl/server";
import TourPageClient from "./TourPageClient";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "tour" });
  
  return {
    title: `${t("title")} | Taylor Swift`,
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: `${t("title")} | Taylor Swift`,
      description: t("description"),
      type: "website",
    },
  };
}

export default function TourPage() {
  return <TourPageClient />;
}
