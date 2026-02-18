import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import SongDetailPage from "@/components/SongDetailPage";
import { getAllSongs, Song } from "@/utils/songs";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export async function generateStaticParams() {
  const songs = getAllSongs();
  return songs.map((song) => ({
    songId: song.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ songId: string }>;
}) {
  const { songId } = await params;
  const locale = await getLocale();
  const songs = getAllSongs();
  const song = songs.find((s) => s.id === songId);
  if (!song) return {};

  const t = await getTranslations({ locale, namespace: "songs" });

  return {
    title: `${song.title} | Taylor Swift`,
    description: `${t("about")} ${song.title} - ${song.album.title}`,
    openGraph: {
      title: `${song.title} | Taylor Swift`,
      description: `${t("about")} ${song.title} - ${song.album.title}`,
      type: "music.song",
    },
  };
}

export default async function SongPage({
  params,
}: {
  params: Promise<{ songId: string }>;
}) {
  const { songId } = await params;
  const songs = getAllSongs();
  const song = songs.find((s) => s.id === songId);

  if (!song) {
    notFound();
  }

  return (
    <ContainerGradientNoPadding>
      <SongDetailPage songId={songId} />
    </ContainerGradientNoPadding>
  );
}
