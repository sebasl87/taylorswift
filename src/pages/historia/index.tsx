import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslations } from "next-intl";
import HistoriaClient from "./HistoriaClient";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export default function HistoriaPage() {
  const t = useTranslations("historyPage");

  return (
    <>
      <Head>
        <title>{`${t("title")} | Taylor Swift`}</title>
        <meta name="description" content={t("description")} />
        <meta name="keywords" content={t("keywords")} />
        <meta property="og:title" content={`${t("title")} | Taylor Swift`} />
        <meta property="og:description" content={t("description")} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content="/images/historia/eras-timeline-hero.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t("title")} | Taylor Swift`} />
        <meta name="twitter:description" content={t("description")} />
        <meta
          name="twitter:image"
          content="/images/historia/eras-timeline-hero.jpg"
        />
        <link rel="canonical" href="/historia" />
      </Head>
      <ContainerGradientNoPadding>
        <HistoriaClient />
      </ContainerGradientNoPadding>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
};
