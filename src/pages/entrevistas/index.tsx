import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useTranslations } from "next-intl";
import InterviewsListPage from "@/components/InterviewsListPage";

export default function InterviewsPage() {
  const t = useTranslations("interviews");

  const title = `${t("listTitle")} | Taylor Swift`;
  const description = t("listDescription");

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="Taylor Swift, entrevistas, interviews, pop, country, The Eras Tour, declaraciones, statements, conversaciones, conversations" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="/entrevistas" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/entrevistas/og-interviews.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/images/entrevistas/og-interviews.jpg" />
      </Head>
      <InterviewsListPage />
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
