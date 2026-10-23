import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import ContactoPageContent from "./ContactoPageContent";

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
    alternates: {
      canonical: "/contacto",
    },
  };
}

export default function ContactPage() {
  return <ContactoPageContent />;
}