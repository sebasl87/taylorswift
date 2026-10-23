import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import TerminosPageContent from "./TerminosPageContent";

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
    alternates: {
      canonical: "/terminos",
    },
  };
}

export default function TermsPage() {
  return <TerminosPageContent />;
}