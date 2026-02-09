import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import BootlegDetailPage from "@/components/BootlegDetailPage";
import bootlegsData from "@/constants/bootlegs.json";
import { Bootleg, generateBootlegSlug, getBootlegYear } from "@/types/bootleg";

function findBootlegBySlug(slug: string): Bootleg | null {
  const bootleg = (bootlegsData as Bootleg[]).find((b) => {
    return generateBootlegSlug(b) === slug;
  });
  return bootleg || null;
}

export async function generateStaticParams() {
  const bootlegs = bootlegsData as Bootleg[];
  return bootlegs.map((bootleg) => ({
    bootlegId: generateBootlegSlug(bootleg),
  }));
}

export async function generateMetadata({ params: { bootlegId, locale } }: { params: { bootlegId: string, locale: string } }): Promise<Metadata> {
  const bootleg = findBootlegBySlug(bootlegId);
  if (!bootleg) return { title: "Bootleg Not Found" };

  const title = `${bootleg.title} - ${bootleg.city}`;
  const description =
    locale === "es" ? bootleg.description.es : bootleg.description.en;
  const year = getBootlegYear(bootleg);
  const fullTitle = `${title} (${year}) | Taylor Swift Bootlegs`;

  return {
    title: fullTitle,
    description: description,
    openGraph: {
        title: fullTitle,
        description: description,
        type: "article",
        images: [bootleg.image || "/images/bootlegs/default-bootleg.jpg"],
    }
  };
}

export default function BootlegPage({ params: { bootlegId } }: { params: { bootlegId: string } }) {
  const bootleg = findBootlegBySlug(bootlegId);

  if (!bootleg) {
    return <div>Bootleg not found</div>;
  }

  return <BootlegDetailPage bootleg={bootleg} />;
}
