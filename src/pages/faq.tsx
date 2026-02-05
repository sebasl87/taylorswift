import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useTranslations } from "next-intl";
import { Container, Typography, Box } from "@mui/material";
import { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export default function FAQPage() {
  const t = useTranslations("faq");
  const tb = useTranslations("breadcrumb");

  useEffect(() => {
    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: t("q1"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("a1"),
          },
        },
        {
          "@type": "Question",
          name: t("q2"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("a2"),
          },
        },
        {
          "@type": "Question",
          name: t("q3"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("a3"),
          },
        },
      ],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-jsonld";
    script.text = JSON.stringify(faqJsonLd);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("faq-jsonld");
      if (el) document.head.removeChild(el);
    };
  }, [t]);

  return (
    <>
      <Head>
        <title>{`${t("title")} | Taylor Swift`}</title>
        <meta name="description" content={t("description") || "FAQ about Taylor Swift"} />
      </Head>
      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("faq") }]} />
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
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              {t("q1")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
            >
              {t("a1")}
            </Typography>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              {t("q2")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
            >
              {t("a2")}
            </Typography>
             <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              {t("q3")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
            >
              {t("a3")}
            </Typography>
          </Box>
        </Container>
      </ContainerGradientNoPadding>
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
