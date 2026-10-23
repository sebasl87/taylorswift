import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import ContactoPageContent from "./ContactoPageContent";
import { i18nAlternates } from "@/utils/i18nAlternates";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "contact" });

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    alternates: i18nAlternates("/contacto", locale),
  };
}

export default function ContactPage() {
  return <ContactoPageContent />;
}