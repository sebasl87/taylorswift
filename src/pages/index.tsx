import { GetStaticProps } from 'next';
import Head from 'next/head';
import TaylorHero from "@/components/TaylorHero";

export default function HomePage() {
  return (
    <>
      <Head>
         <title>Taylor Swift: The Eras Tour, Noticias, Álbumes</title>
         <meta name="description" content="Todo sobre Taylor Swift: The Eras Tour, noticias, discografía, letras y más. Sitio de fans." />
      </Head>
      <TaylorHero />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default
    }
  };
}
