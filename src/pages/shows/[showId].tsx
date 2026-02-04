import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useTranslations, useLocale } from 'next-intl';
import ShowDetailPage from "@/components/ShowDetailPage";
import showsData from "@/constants/shows.json";
import { Show, generateShowSlug, formatShowDate } from "@/types/show";

interface ShowPageProps {
  show: Show;
}

// Función para encontrar show por slug (reused logic)
function findShowBySlug(slug: string): Show | null {
  const show = (showsData as Show[]).find((s) => {
    return generateShowSlug(s) === slug;
  });
  return show || null;
}

export default function ShowPage({ show }: ShowPageProps) {
  const t = useTranslations('shows'); // Assuming we might need translations for meta if not passed from props
  const locale = useLocale();

  // Metadata logic adapted for Pages Router (Head)
  const title = `${show.venue} - ${show.city}`;
  const description = `${show.whyHistoric}`;
  const date = new Date(show.date);
  const year = date.getFullYear();
  const fullTitle = `${title} (${year}) | Taylor Swift Shows`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={show.image || "/images/shows/default-show.jpg"} />
        {/* Add more meta tags as needed */}
      </Head>
      <ShowDetailPage show={show} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const shows = showsData as Show[];
  const locales = ['en', 'es'];
  const paths: { params: { showId: string }, locale: string }[] = [];

  shows.forEach((show) => {
    const slug = generateShowSlug(show);
    locales.forEach((locale) => {
      paths.push({ params: { showId: slug }, locale });
    });
  });

  return {
    paths,
    fallback: false, // Return 404 for unknown slugs
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const showId = params?.showId as string;
  const show = findShowBySlug(showId);

  if (!show) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      show,
      messages: (await import(`../../../messages/${locale}.json`)).default
    }
  };
};
