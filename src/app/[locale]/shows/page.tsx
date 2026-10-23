import { getTranslations, getLocale } from "next-intl/server";
import ShowsListPage from "@/components/ShowsListPage";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import { i18nAlternates } from "@/utils/i18nAlternates";
import { absoluteUrl } from "@/utils/absoluteUrl";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shows" });
  const title = `${t("listTitle")} | Taylor Swift`;
  const description = t("listDescription");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl("/shows", locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: i18nAlternates("/shows", locale),
  };
}

export default function ShowsPage() {
  return (
    <ContainerGradientNoPadding>
      <ShowsListPage />
    </ContainerGradientNoPadding>
  );
}
