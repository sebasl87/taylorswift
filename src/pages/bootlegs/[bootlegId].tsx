import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useTranslations, useLocale } from 'next-intl';
import BootlegDetailPage from "@/components/BootlegDetailPage";
import bootlegsData from "@/constants/bootlegs.json";
import { Bootleg, generateBootlegSlug, formatBootlegDate, getBootlegYear } from "@/types/bootleg";

interface BootlegPageProps {
  bootleg: Bootleg;
}

// Función para encontrar bootleg por slug (reused logic)
function findBootlegBySlug(slug: string): Bootleg | null {
  const bootleg = (bootlegsData as Bootleg[]).find((b) => {
    return generateBootlegSlug(b) === slug;
  });
  return bootleg || null;
}

export default function BootlegPage({ bootleg }: BootlegPageProps) {
  const t = useTranslations('bootlegs');
  const locale = useLocale();

  const title = `${bootleg.title} - ${bootleg.city}`;
  const description = locale === "es" ? bootleg.description.es : bootleg.description.en;
  const year = getBootlegYear(bootleg);
  const fullTitle = `${title} (${year}) | Taylor Swift Bootlegs`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={bootleg.image || "/images/bootlegs/default-bootleg.jpg"} />
        {/* Add more meta tags as needed */}
      </Head>
      <BootlegDetailPage bootleg={bootleg} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const bootlegs = bootlegsData as Bootleg[];
  const locales = ['en', 'es'];
  const paths: { params: { bootlegId: string }, locale: string }[] = [];

  bootlegs.forEach((bootleg) => {
    const slug = generateBootlegSlug(bootleg);
    locales.forEach((locale) => {
      paths.push({ params: { bootlegId: slug }, locale });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const bootlegId = params?.bootlegId as string;
  const bootleg = findBootlegBySlug(bootlegId);

  if (!bootleg) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      bootleg,
      messages: (await import(`../../../messages/${locale}.json`)).default
    }
  };
};
