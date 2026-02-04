import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';

export default function Custom404() {
  const t = useTranslations('notFound');

  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          {t('heading')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('message')}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Link href="/" passHref>
            <Button variant="contained" color="primary">
              {t('goHome')}
            </Button>
          </Link>
        </Box>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default
    }
  };
};
