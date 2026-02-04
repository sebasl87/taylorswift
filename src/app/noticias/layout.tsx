import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("news");

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    keywords:
      "Taylor Swift, noticias, news, pop, country, Eras Tour, actualidad, últimas noticias, tour, conciertos",
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      url: "https://taylorswiftfan.com/noticias",
      siteName: "Taylor Swift Fan Site",
      locale: "es_AR",
      type: "website",
      images: [
        {
          url: "https://taylorswiftfan.com/logo-taylor.png",
          width: 1200,
          height: 630,
          alt: "Taylor Swift",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("pageTitle"),
      description: t("pageDescription"),
      images: ["https://taylorswiftfan.com/logo-taylor.png"],
    },
    alternates: {
      canonical: "https://taylorswiftfan.com/noticias",
      languages: {
        es: "https://taylorswiftfan.com/noticias",
        en: "https://taylorswiftfan.com/noticias",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
