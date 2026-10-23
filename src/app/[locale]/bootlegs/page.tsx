import { getTranslations, getLocale } from "next-intl/server";
import { Metadata } from "next";
import BootlegsListPage from '@/components/BootlegsListPage';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "bootlegs" });
  return {
    title: `${t("listTitle")} | Taylor Swift`,
    description: t("listDescription"),
    openGraph: {
      title: `${t("listTitle")} | Taylor Swift`,
      description: t("listDescription"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("listTitle")} | Taylor Swift`,
      description: t("listDescription"),
    },
    alternates: {
      canonical: "/bootlegs",
    },
  };
}

export default function BootlegsPage() {
  return <BootlegsListPage />;
}
