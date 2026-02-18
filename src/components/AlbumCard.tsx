"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import AppleIcon from "@mui/icons-material/Apple";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import type { Album } from "@/types/album";
import { useLocale } from "next-intl";
import { getAlbumDescription } from "@/utils/albumHelpers";

function StreamingIcons({ links }: { links?: Album["streaming"] }) {
  if (!links) return null;
  const { spotify, appleMusic, youtube, tidal, deezer, bandcamp } = links;
  const iconBtn = (href: string, label: string, icon: React.ReactNode) => (
    <Tooltip title={label} key={label}>
      <IconButton
        size="small"
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          window.open(href, "_blank", "noopener,noreferrer");
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  return (
    <Stack direction="row" spacing={0.5}>
      {spotify &&
        iconBtn(
          spotify,
          "Escuchar en Spotify",
          <Image src="/spotify.png" alt="Spotify" width={20} height={20} />
        )}
      {appleMusic &&
        iconBtn(appleMusic, "Escuchar en Apple Music", <AppleIcon />)}
      {youtube && iconBtn(youtube, "Ver en YouTube", <YouTubeIcon />)}
      {tidal && iconBtn(tidal, "Escuchar en Tidal", <MusicNoteIcon />)}
      {deezer && iconBtn(deezer, "Escuchar en Deezer", <MusicNoteIcon />)}
      {bandcamp && iconBtn(bandcamp, "Ver en Bandcamp", <MusicNoteIcon />)}
    </Stack>
  );
}

export default function AlbumCard({ album }: { album: Album }) {
  const locale = useLocale();

  const metaChips = (
    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
      <Chip size="small" label={album.year} />
      {album.label && (
        <Chip size="small" label={album.label} variant="outlined" />
      )}
      {album.isUpcoming && album.releaseDate && (
        <Chip
          size="small"
          color="primary"
          label={`Lanzamiento: ${new Date(
            album.releaseDate
          ).toLocaleDateString()}`}
        />
      )}
    </Stack>
  );

  return (
    <Link
      href={`/discography/${album.id}`}
      passHref
      legacyBehavior
    >
      <Card
        component="a"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderColor: "primary.main",
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
        }}
        variant="outlined"
      >
        <Box
          sx={{
            position: "relative",
            aspectRatio: "1/1",
            bgColor: "background.paper",
          }}
        >
          <Image
            src={album.cover}
            alt={`${album.title} cover`}
            fill
            sizes="(max-width: 600px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            priority={album.isUpcoming}
            loading={album.isUpcoming ? undefined : "lazy"}
          />
          {album.isUpcoming && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Próximo lanzamiento
            </Box>
          )}
        </Box>

        <CardHeader
          title={
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, lineHeight: 1.2, mb: 1 }}
            >
              {album.title}
            </Typography>
          }
          subheader={metaChips}
          sx={{ pb: 0 }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          {album.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {getAlbumDescription(album, locale, "short")}
            </Typography>
          )}

          {album.producers?.length ? (
            <Typography variant="caption" color="text.secondary">
              Productores: {album.producers.join(", ")}
            </Typography>
          ) : null}
        </CardContent>

        <Box sx={{ px: 2, pb: 1 }}>
          <StreamingIcons links={album.streaming} />
        </Box>
      </Card>
    </Link>
  );
}
