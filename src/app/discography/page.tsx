import DiscographyGrid from "@/components/DiscographyGrid";
import studioAlbums from "../../constants/discography.json";
import liveAlbums from "../../constants/liveAlbums.json";
import compilations from "../../constants/compilations.json";
import eps from "../../constants/eps.json";
import { Typography, Box } from "@mui/material";
import type { Album } from "@/types/album";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "@/components/NewsBanner";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titleByLocale = {
    es: "Discografía Completa de Megadeth | 16 Álbumes de Estudio + En Vivo y Compilaciones",
    en: "Complete Megadeth Discography | 16 Studio Albums + Live & Compilations",
  };

  const descriptionByLocale = {
    es: "Discografía completa de Megadeth (1985-2022): 16 álbumes de estudio desde Killing Is My Business hasta The Sick, The Dying and the Dead, más álbumes en vivo, compilaciones y EPs. Información detallada, portadas, productores, músicos y enlaces a streaming.",
    en: "Complete Megadeth discography (1985-2022): 16 studio albums from Killing Is My Business to The Sick, The Dying and the Dead, plus live albums, compilations and EPs. Detailed information, covers, producers, musicians and streaming links.",
  };

  const keywordsByLocale = {
    es: [
      "Megadeth discografía",
      "álbumes Megadeth",
      "Killing Is My Business",
      "Peace Sells",
      "So Far So Good So What",
      "Rust in Peace",
      "Countdown to Extinction",
      "Youthanasia",
      "Cryptic Writings",
      "Risk",
      "The World Needs a Hero",
      "The System Has Failed",
      "United Abominations",
      "Endgame",
      "Thirteen",
      "Super Collider",
      "Dystopia",
      "The Sick, The Dying and the Dead",
      "Dave Mustaine",
      "Marty Friedman",
      "thrash metal",
      "metal discografía",
      "big four thrash",
      "álbumes de estudio",
      "compilaciones metal",
      "streaming Megadeth",
    ],
    en: [
      "Megadeth discography",
      "Megadeth albums",
      "Killing Is My Business",
      "Peace Sells",
      "So Far So Good So What",
      "Rust in Peace",
      "Countdown to Extinction",
      "Youthanasia",
      "Cryptic Writings",
      "Risk",
      "The World Needs a Hero",
      "The System Has Failed",
      "United Abominations",
      "Endgame",
      "Thirteen",
      "Super Collider",
      "Dystopia",
      "The Sick, The Dying and the Dead",
      "Dave Mustaine",
      "Marty Friedman",
      "thrash metal",
      "metal discography",
      "big four thrash",
      "studio albums",
      "metal compilations",
      "Megadeth streaming",
    ],
  };

  return {
    title:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description:
      descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
      descriptionByLocale.es,
    keywords:
      keywordsByLocale[locale as keyof typeof keywordsByLocale] ||
      keywordsByLocale.es,
    authors: [{ name: "Megadeth Fan Site" }],
    creator: "Megadeth Fan Site",
    publisher: "Megadeth Fan Site",
    alternates: {
      canonical: "/discography",
      languages: {
        es: "/discography",
        en: "/discography",
      },
    },
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      url: "/discography",
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-discography.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "Discografía de Megadeth - 16 álbumes de estudio desde Killing Is My Business hasta The Sick, The Dying and the Dead"
              : "Megadeth Discography - 16 studio albums from Killing Is My Business to The Sick, The Dying and the Dead",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      images: ["/og-discography.jpg"],
      creator: "@MegadethFanSite",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function AlbumsPage() {
  const t = useTranslations("discography");
  const tb = useTranslations("breadcrumb");

  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 2, md: 4 }}>
        <Breadcrumb items={[{ label: tb("discography") }]} />
      </Box>
      {/* Álbumes de Estudio */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("studioAlbums")}
        </Typography>
        <DiscographyGrid albums={studioAlbums as unknown as Album[]} />
      </Box>

      {/* Álbumes en Vivo */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #ff9800, #e91e63)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("liveAlbums")}
        </Typography>
        <DiscographyGrid albums={liveAlbums as unknown as Album[]} />
      </Box>

      {/* Compilaciones */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #9c27b0, #673ab7)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("compilations")}
        </Typography>
        <DiscographyGrid albums={compilations as unknown as Album[]} />
      </Box>

      {/* EPs */}
      <Box mb={4}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #795548, #ff5722)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("eps")}
        </Typography>
        <DiscographyGrid albums={eps as unknown as Album[]} />
        <Box
          mt={4}
          sx={{
            px: { xs: 2, sm: 2, md: 0 },
          }}
        >
          <RandomSectionBanner currentSection="discography" />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
