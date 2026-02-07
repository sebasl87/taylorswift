"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  Link as MuiLink,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { CalendarMonth, Place } from "@mui/icons-material";

interface Song {
  name: string;
  tape: boolean;
  info: string | null;
  cover: string | null;
}

interface Show {
  id: string;
  eventDate: string;
  eventDateISO: string;
  venue: {
    name: string;
    url: string;
  };
  city: {
    name: string;
    state: string;
    countryCode: string;
    countryName: string;
  };
  songs: Song[];
  url: string;
  tour: string | null;
  attribution: {
    text: string;
    url: string;
  };
}

interface LastShowsData {
  latest: Show | null;
  yearsAgoPrev: Show | null;
}

function formatDate(dateString: string, locale: string): string {
  const [day, month, year] = dateString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function songNameToUrl(songName: string): string {
  return songName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, "")
    .replace(/ /g, "-");
}

function ShowCard({
  show,
  title,
  imageSrc,
}: {
  show: Show;
  title: string;
  imageSrc: string;
}) {
  const locale = useLocale();
  const t = useTranslations("lastShows");

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          transition: "transform 0.3s ease",
        },
      }}
    >
      {/* Imagen de encabezado */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 180,
          overflow: "hidden",
        }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        {/* Info del show */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <CalendarMonth fontSize="small" color="primary" />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.85rem", md: "0.95rem" },
              }}
            >
              {formatDate(show.eventDate, locale)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              mb: 1,
            }}
          >
            <Place fontSize="small" color="primary" sx={{ mt: 0.2 }} />
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                }}
              >
                {show.venue.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
              >
                {show.city.name}, {show.city.state && `${show.city.state}, `}
                {show.city.countryName}
              </Typography>
            </Box>
          </Box>

          {show.tour && (
            <Chip
              label={show.tour}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 1, fontSize: { xs: "0.7rem", md: "0.75rem" } }}
            />
          )}
        </Box>

        {/* Setlist */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {t("setlist")} ({show.songs.length})
        </Typography>
        <List
          dense
          sx={{
            maxHeight: 300,
            overflow: "auto",
            p: 0,
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(144, 202, 249, 0.4)",
              borderRadius: "4px",
              transition: "background 0.3s ease",
              "&:hover": {
                background: "rgba(144, 202, 249, 0.7)",
              },
            },
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(144, 202, 249, 0.4) transparent",
          }}
        >
          {show.songs.map((song, index) => (
            <ListItem
              key={index}
              sx={{
                py: 0.5,
                px: 0,
                display: "flex",
                gap: 1,
              }}
            >
              <Typography
                component="span"
                sx={{
                  minWidth: 24,
                  color: "text.secondary",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                {index + 1}.
              </Typography>
              <Link
                href={`/songs/${songNameToUrl(song.name)}`}
                passHref
                legacyBehavior
              >
                <Typography
                  component="a"
                  sx={{
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "text.primary",
                    transition: "color 0.2s",
                    "&:hover": {
                      color: "primary.main",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {song.name}
                </Typography>
              </Link>
            </ListItem>
          ))}
        </List>

        {/* Créditos */}
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
          <MuiLink
            href={show.attribution.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontSize: { xs: "0.7rem", md: "0.75rem" },
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": {
                color: "primary.main",
                textDecoration: "underline",
              },
            }}
          >
            {show.attribution.text}
          </MuiLink>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function LastShowsCards() {
  const [data, setData] = useState<LastShowsData | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("lastShows");

  useEffect(() => {
    fetch("/api/last-show")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching last shows:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null; // No mostrar nada mientras carga
  }

  if (!data || (!data.latest && !data.yearsAgoPrev)) {
    return null; // No mostrar nada si no hay datos
  }

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Grid container spacing={3}>
        {data.latest && (
          <Grid size={{ xs: 12, md: 6 }}>
            <ShowCard
              show={data.latest}
              title={t("latestShow")}
              imageSrc="/images/banners/new.jpg"
            />
          </Grid>
        )}
        {data.yearsAgoPrev && (
          <Grid size={{ xs: 12, md: 6 }}>
            <ShowCard
              show={data.yearsAgoPrev}
              title={t("yearsAgo")}
              imageSrc="/images/banners/old.jpg"
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
