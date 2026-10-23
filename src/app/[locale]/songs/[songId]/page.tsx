import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import SongDetailPage from "@/components/SongDetailPage";
import { getAllSongs, type Song } from "@/utils/songs";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import { i18nAlternates } from "@/utils/i18nAlternates";
import { absoluteUrl } from "@/utils/absoluteUrl";

export async function generateStaticParams() {
  const songs = getAllSongs();
  return songs.map((song) => ({
    songId: song.id,
  }));
}

function buildDescription(song: Song, locale: string): string {
  const { title, album } = song;
  const writers = song.credits.writers.lyrics.join(", ");
  const full =
    locale === "es"
      ? `"${title}" de Taylor Swift, tema ${song.details.track_number} de ${album.title} (${album.year}). Letra completa, compositores (${writers}) y duración ${song.details.duration}.`
      : `"${title}" by Taylor Swift, track ${song.details.track_number} on ${album.title} (${album.year}). Full lyrics, songwriting credits (${writers}) and duration ${song.details.duration}.`;
  if (full.length <= 160) return full;
  return locale === "es"
    ? `"${title}" de Taylor Swift, tema ${song.details.track_number} de ${album.title} (${album.year}). Letra completa y créditos.`
    : `"${title}" by Taylor Swift, track ${song.details.track_number} on ${album.title} (${album.year}). Full lyrics and credits.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ songId: string }>;
}): Promise<Metadata> {
  const { songId } = await params;
  const locale = await getLocale();
  const songs = getAllSongs();
  const song = songs.find((s) => s.id === songId);
  if (!song) return {};

  const pageTitle =
    locale === "es"
      ? `${song.title} de Taylor Swift: letra y créditos (${song.album.year})`
      : `${song.title} by Taylor Swift: Lyrics & Credits (${song.album.year})`;
  const description = buildDescription(song, locale);

  return {
    title: pageTitle,
    description,
    keywords: [
      song.title,
      song.album.title,
      "Taylor Swift",
      locale === "es" ? "letra" : "lyrics",
      ...song.credits.writers.lyrics,
    ],
    openGraph: {
      title: pageTitle,
      description,
      type: "music.song",
      url: absoluteUrl(`/songs/${songId}`, locale),
      locale: locale === "es" ? "es_AR" : "en_US",
      images: [song.album.cover],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [song.album.cover],
    },
    alternates: i18nAlternates(`/songs/${songId}`, locale),
  };
}

function parseDurationToISO8601(duration?: string): string | undefined {
  if (!duration) return undefined;
  const parts = duration.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return undefined;
  const [minutes, seconds] = parts.length === 2 ? parts : [0, parts[0]];
  return `PT${minutes}M${seconds}S`;
}

function buildSongJsonLd(song: Song, locale: string) {
  const writers = song.credits.writers.lyrics.map((name) => ({
    "@type": "Person",
    name,
  }));
  const duration = parseDurationToISO8601(song.details.duration);

  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    byArtist: { "@type": "MusicGroup", name: "Taylor Swift" },
    ...(duration && { duration }),
    inAlbum: {
      "@type": "MusicAlbum",
      name: song.album.title,
      url: absoluteUrl(`/discography/${song.album.id}`, locale),
      datePublished: `${song.album.year}`,
    },
    recordingOf: {
      "@type": "MusicComposition",
      name: song.title,
      ...(writers.length > 0 && { lyricist: writers, composer: writers }),
    },
    image: `https://taylorswift.com.ar${song.album.cover}`,
    url: absoluteUrl(`/songs/${song.id}`, locale),
  };
}

export default async function SongPage({
  params,
}: {
  params: Promise<{ songId: string }>;
}) {
  const { songId } = await params;
  const locale = await getLocale();
  const songs = getAllSongs();
  const song = songs.find((s) => s.id === songId);

  if (!song) {
    notFound();
  }

  return (
    <ContainerGradientNoPadding>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildSongJsonLd(song, locale)),
        }}
      />
      <SongDetailPage songId={songId} />
    </ContainerGradientNoPadding>
  );
}
