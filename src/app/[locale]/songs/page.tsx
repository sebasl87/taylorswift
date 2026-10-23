import { getTranslations, getLocale } from "next-intl/server";
import SongsListPage from "@/components/SongsListPage";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "songs" });
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

export default function SongsPage() {
  return (
    <ContainerGradientNoPadding>
      <SongsListPage />
    </ContainerGradientNoPadding>
  );
}
