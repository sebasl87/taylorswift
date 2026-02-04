import { notFound } from "next/navigation";
import BootlegDetailPage from "@/components/BootlegDetailPage";
import bootlegsData from "@/constants/bootlegs.json";
import {
  Bootleg,
  generateBootlegSlug,
  formatBootlegDate,
  getBootlegYear,
} from "@/types/bootleg";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";

interface BootlegPageProps {
  params: Promise<{
    bootlegId: string;
  }>;
}

// Función para encontrar bootleg por slug
function findBootlegBySlug(slug: string): Bootleg | null {
  const bootleg = (bootlegsData as Bootleg[]).find((b) => {
    return generateBootlegSlug(b) === slug;
  });
  return bootleg || null;
}

export async function generateStaticParams() {
  return (bootlegsData as Bootleg[]).map((bootleg: Bootleg) => ({
    bootlegId: generateBootlegSlug(bootleg),
  }));
}

export async function generateMetadata({
  params,
}: BootlegPageProps): Promise<Metadata> {
  const { bootlegId } = await params;
  const locale = await getLocale();
  const bootleg = findBootlegBySlug(bootlegId);

  if (!bootleg) return { title: "Bootleg no encontrado" };

  const title = `${bootleg.title} - ${bootleg.city}`;
  const description =
    locale === "es" ? bootleg.description.es : bootleg.description.en;
  const year = getBootlegYear(bootleg);

  const fullTitle = `${title} (${year}) | Taylor Swift Bootlegs`;
  const keywords = [
    "Taylor Swift",
    "bootleg",
    bootleg.title,
    bootleg.venue,
    bootleg.city,
    bootleg.country,
    bootleg.era,
    year.toString(),
    "live recording",
    "grabación en vivo",
    "YouTube",
    ...bootleg.setlist,
  ];

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      url: `/bootlegs/${bootlegId}`,
      siteName: "Taylor Swift Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "article",
      publishedTime: bootleg.date,
      images: [
        {
          url: bootleg.image || "/images/bootlegs/default-bootleg.jpg",
          width: 1200,
          height: 630,
          alt: `${title} - ${formatBootlegDate(bootleg.date, locale)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [bootleg.image || "/images/bootlegs/default-bootleg.jpg"],
      creator: "@TaylorSwiftFanSite",
    },
    alternates: {
      canonical: `/bootlegs/${bootlegId}`,
      languages: {
        es: `/bootlegs/${bootlegId}`,
        en: `/bootlegs/${bootlegId}`,
      },
    },
    other: {
      "article:published_time": bootleg.date,
      "article:section": "Bootlegs",
      "article:tag": bootleg.era,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BootlegPage({ params }: BootlegPageProps) {
  const { bootlegId } = await params;
  const bootleg = findBootlegBySlug(bootlegId);

  if (!bootleg) {
    notFound();
  }

  return <BootlegDetailPage bootleg={bootleg} />;
}
