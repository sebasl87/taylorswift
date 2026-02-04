import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useTranslations } from "next-intl";
import { Container, Typography, Box, Button } from "@mui/material";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tb = useTranslations("breadcrumb");

  return (
    <>
      <Head>
        <title>{`${t("title")} | Taylor Swift Fan Site`}</title>
        <meta name="description" content={t("description")} />
        <meta name="keywords" content="Taylor Swift contact, contact Taylor Swift Fan Site, email Taylor Swift" />
      </Head>
      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("contact") }]} />
        </Box>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            color="primary"
            fontWeight={700}
            sx={{ fontSize: { xs: "1.75rem", md: "3rem" } }}
          >
            {t("title")}
          </Typography>
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2, fontSize: { xs: "0.9rem", md: "1rem" } }}
            >
              {t("description")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="mailto:contact@taylorswiftfan.com"
              sx={{ fontWeight: 600 }}
            >
              {t("emailButton")}
            </Button>
          </Box>
        </Container>
      </ContainerGradientNoPadding>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default
    }
  };
};
