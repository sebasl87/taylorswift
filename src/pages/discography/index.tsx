import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslations } from "next-intl";
import DiscographyGrid from "@/components/DiscographyGrid";
import discographyData from "@/constants/discography.json";
import { Album } from "@/types/album";
import { Typography, Box } from "@mui/material";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Breadcrumb from "@/components/Breadcrumb";
import { useEra } from "@/context/EraContext";

export default function DiscographyPage() {
  const t = useTranslations("discography");
  const { currentEra } = useEra();

  const studioAlbums = discographyData as unknown as Album[];

  return (
    <>
      <Head>
        <title>{`${t("title")} | Taylor Swift`}</title>
        <meta name="description" content={t("description")} />
        <meta property="og:title" content={`${t("title")} | Taylor Swift`} />
        <meta property="og:description" content={t("description")} />
        <meta property="og:type" content="website" />
      </Head>

      <ContainerGradientNoPadding>
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: currentEra.colors.heroOverlay || "rgba(0,0,0,0.2)",
              pointerEvents: "none",
              transition: "background 0.5s ease",
              zIndex: 0,
            },
          }}
        >
          <Box
            pt="100px"
            pb={{ xs: 4, md: 6 }}
            maxWidth="1440px"
            mx="auto"
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <Breadcrumb items={[{ label: t("title") }]} />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                mb: 4,
                color: currentEra.colors.heroText || "#FFFFFF",
                textShadow: `2px 2px 8px ${currentEra.shadowColor}, 
                           0 0 20px ${currentEra.shadowColor}`,
                transition: "color 0.5s ease, text-shadow 0.5s ease",
              }}
            >
              {t("title")}
            </Typography>

            <DiscographyGrid albums={studioAlbums} />
          </Box>
        </Box>
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
