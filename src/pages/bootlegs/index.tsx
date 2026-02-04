import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import BootlegsListPage from '@/components/BootlegsListPage';

export default function BootlegsPage() {
  const t = useTranslations('bootlegs');
  
  return (
    <>
      <Head>
        <title>{`${t('listTitle')} | Taylor Swift`}</title>
        <meta name="description" content={t('listDescription')} />
        <meta property="og:title" content={`${t('listTitle')} | Taylor Swift`} />
        <meta property="og:description" content={t('listDescription')} />
        <meta property="og:type" content="website" />
      </Head>
      <BootlegsListPage />
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
