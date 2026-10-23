import { getLocale } from "next-intl/server";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bootlegId: string }>;
}): Promise<Metadata> {
  const { bootlegId } = await params;
  const locale = await getLocale();
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
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description,
      images: [bootleg.image || "/images/bootlegs/default-bootleg.jpg"],
    },
    alternates: {
      canonical: `/bootlegs/${bootlegId}`,
    },
  };
}

export default async function BootlegPage({
  params,
}: {
  params: Promise<{ bootlegId: string }>;
}) {
  const { bootlegId } = await params;
  const bootleg = findBootlegBySlug(bootlegId);

  if (!bootleg) {
    return <div>Bootleg not found</div>;
  }

  return <BootlegDetailPage bootleg={bootleg} />;
}
