import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import InterviewsListPage from "@/components/InterviewsListPage";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "interviews" });
  return {
    title: `${t("listTitle")} | Taylor Swift`,
    description: t("listDescription"),
    keywords: "Taylor Swift, entrevistas, interviews, pop, country, The Eras Tour, declaraciones, statements, conversaciones, conversations",
    openGraph: {
        title: `${t("listTitle")} | Taylor Swift`,
        description: t("listDescription"),
        url: "/entrevistas",
        type: "website",
        images: ["/images/entrevistas/og-interviews.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: `${t("listTitle")} | Taylor Swift`,
        description: t("listDescription"),
        images: ["/images/entrevistas/og-interviews.jpg"],
    }
  };
}

export default function InterviewsPage() {
  return <InterviewsListPage />;
}
