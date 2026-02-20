"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useEra } from "@/context/EraContext";

interface Section {
  id: string;
  name: { es: string; en: string };
  route: string;
  image: string;
  adText: { es: string; en: string };
}

const sections: Section[] = [
  {
    id: "news",
    name: { es: "Noticias", en: "News" },
    route: "/noticias",
    image: "/images/banners/news2.png",
    adText: {
      es: "Mantente al día con las últimas novedades",
      en: "Stay up to date with the latest news",
    },
  },
  {
    id: "tour",
    name: { es: "Tour", en: "Tour" },
    route: "/tour",
    image: "/images/banners/tour2.png",
    adText: {
      es: "Conoce las próximas fechas de la gira",
      en: "Discover upcoming tour dates",
    },
  },
  {
    id: "songs",
    name: { es: "Canciones", en: "Songs" },
    route: "/songs",
    image: "/images/banners/songs2.png",
    adText: {
      es: "Descubre todas las canciones, letras y más!",
      en: "Discover all songs, lyrics and more!",
    },
  },
  {
    id: "shows",
    name: { es: "Shows", en: "Shows" },
    route: "/shows",
    image: "/images/banners/shows2.png",
    adText: {
      es: "Revive todos los conciertos históricos",
      en: "Relive all the historic concerts",
    },
  },
  {
    id: "interviews",
    name: { es: "Entrevistas", en: "Interviews" },
    route: "/entrevistas",
    image: "/images/banners/interviews2.png",
    adText: {
      es: "Lee y mira las entrevistas más interesantes",
      en: "Read the most interesting interviews",
    },
  },
  {
    id: "era",
    name: { es: "Eras", en: "Eras" },
    route: "/era",
    image: "/images/banners/history2.png",
    adText: {
      es: "Explora las diferentes eras de su carrera",
      en: "Explore the different eras of her career",
    },
  },
  {
    id: "discography",
    name: { es: "Discografía", en: "Discography" },
    route: "/discography",
    image: "/images/banners/discography2.png",
    adText: {
      es: "Explora la discografía completa",
      en: "Explore the complete discography",
    },
  },
];

interface RandomSectionBannerProps {
  currentSection: string;
}

export default function RandomSectionBanner({
  currentSection,
}: RandomSectionBannerProps) {
  const router = useRouter();
  const locale = useLocale() as "es" | "en";
  const [randomSection, setRandomSection] = useState<Section | null>(null);
  const { currentEra } = useEra();

  useEffect(() => {
    const availableSections = sections.filter((s) => s.id !== currentSection);
    const randomIndex = Math.floor(Math.random() * availableSections.length);
    setRandomSection(availableSections[randomIndex]);
  }, [currentSection]);

  if (!randomSection) return null;

  const handleClick = () => {
    router.push(randomSection.route);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 720,
        mx: "auto",
      }}
    >
      <Box
        onClick={handleClick}
        sx={{
          position: "relative",
          width: "100%",
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: 2,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: (theme) =>
              `0 8px 24px ${
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.6)"
                  : "rgba(0, 0, 0, 0.2)"
              }`,
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        <Image
          src={randomSection.image}
          alt={randomSection.name[locale]}
          width={1200}
          height={400}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          mt: 1,
          color: currentEra.colors.heroText,
          fontStyle: "italic",
        }}
      >
        {randomSection.adText[locale]}
      </Typography>
    </Box>
  );
}
