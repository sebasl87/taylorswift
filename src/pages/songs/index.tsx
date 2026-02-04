import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import SongsListPage from "@/components/SongsListPage";

export default function SongsPage() {
  const t = useTranslations('songs');
  
  const title = `${t("songsListTitle")} | Taylor Swift`;
  const description = t("songsListDescription");

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {/* Add more meta tags as needed */}
      </Head>
      <SongsListPage />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default
    }
  };
};
