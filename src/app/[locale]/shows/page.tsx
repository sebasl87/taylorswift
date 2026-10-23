import { getTranslations, getLocale } from "next-intl/server";
import ShowsListPage from "@/components/ShowsListPage";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shows" });
  return {
    title: `${t("title")} | Taylor Swift`,
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: `${t("title")} | Taylor Swift`,
      description: t("description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | Taylor Swift`,
      description: t("description"),
    },
    alternates: {
      canonical: "/shows",
    },
  };
}

export default function ShowsPage() {
  return (
    <ContainerGradientNoPadding>
      <ShowsListPage />
    </ContainerGradientNoPadding>
  );
}
