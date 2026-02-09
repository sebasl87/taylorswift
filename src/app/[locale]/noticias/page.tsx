import { getTranslations } from "next-intl/server";
import NoticiasClient from "./NoticiasClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "news" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      type: "website",
    },
  };
}

export default function NoticiasPage() {
  return <NoticiasClient />;
}
