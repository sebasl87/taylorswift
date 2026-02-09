import { getTranslations } from "next-intl/server";
import ShowsListPage from "@/components/ShowsListPage";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
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
  };
}

export default function ShowsPage() {
  return (
    <ContainerGradientNoPadding>
      <ShowsListPage />
    </ContainerGradientNoPadding>
  );
}
