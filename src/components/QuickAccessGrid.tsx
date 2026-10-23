"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function QuickAccessGrid() {
  const t = useTranslations("quickAccess");

  const sections = [
    {
      title: t("discography"),
      image: "/images/cards-home/discografia.jpg",
      count: t("discographyCount"),
      href: "/discography",
    },
    {
      title: t("songs"),
      image: "/images/cards-home/songs.jpg",
      count: t("songsCount"),
      href: "/songs",
    },
    {
      title: t("videos"),
      image: "/images/cards-home/videos.jpg",
      count: t("videosCount"),
      href: "/videos",
    },
    {
      title: t("tour"),
      image: "/images/cards-home/tour.jpg",
      count: t("tourCount"),
      href: "/tour",
    },
    {
      title: t("interviews"),
      image: "/images/cards-home/entrevistas.jpg",
      count: t("interviewsCount"),
      href: "/entrevistas",
    },
    {
      title: t("history"),
      image: "/images/cards-home/historia.jpg",
      count: t("historyCount"),
      href: "/historia",
    },
  ];

  return (
    <Box sx={{ width: "100%", my: 6 }}>
      <Typography
        variant="h3"
        sx={{ mb: 4, fontSize: { xs: 24, md: 36 }, fontWeight: 600 }}
      >
        {t("title")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {sections.map((section) => (
          <Card
            component={Link}
            href={section.href}
            key={section.href}
            sx={{
              height: "100%",
              textDecoration: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 0,
                "&:last-child": { pb: 0 },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 200,
                  mb: 2,
                }}
              >
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Box sx={{ px: 2, pb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mb: 1, fontSize: { xs: 18, md: 22 } }}
                >
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {section.count}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
