import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslations } from "next-intl";
import DiscographyGrid from "@/components/DiscographyGrid";
import discographyData from "@/constants/discography.json";
import liveAlbumsData from "@/constants/liveAlbums.json";
import compilationsData from "@/constants/compilations.json";
import epsData from "@/constants/eps.json";
import { Album } from "@/types/album";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";

export default function DiscographyPage() {
  const t = useTranslations("discography");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const studioAlbums = discographyData as unknown as Album[];
  const liveAlbums = liveAlbumsData as unknown as Album[];
  const compilations = compilationsData as unknown as Album[];
  const eps = epsData as unknown as Album[];

  return (
    <>
      <Head>
        <title>{`${t("title")} | Taylor Swift`}</title>
        <meta name="description" content={t("description")} />
        <meta property="og:title" content={`${t("title")} | Taylor Swift`} />
        <meta property="og:description" content={t("description")} />
        <meta property="og:type" content="website" />
      </Head>

      <Box sx={{ py: 4 }}>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            {t("title")}
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Studio Albums" />
              <Tab label="Live Albums" />
              <Tab label="Compilations" />
              <Tab label="EPs" />
            </Tabs>
          </Box>

          {activeTab === 0 && <DiscographyGrid albums={studioAlbums} />}
          {activeTab === 1 && <DiscographyGrid albums={liveAlbums} />}
          {activeTab === 2 && <DiscographyGrid albums={compilations} />}
          {activeTab === 3 && <DiscographyGrid albums={eps} />}
        </Container>
      </Box>
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
