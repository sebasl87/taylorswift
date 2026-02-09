import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import SongDetailPage from "@/components/SongDetailPage";
import { getAllSongs, Song } from "@/utils/songs";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export async function generateStaticParams() {
  const songs = getAllSongs();
  return songs.map((song) => ({
    songId: song.id,
  }));
}

export async function generateMetadata({ params: { songId, locale } }: { params: { songId: string; locale: string } }) {
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

export default function SongPage({ params: { songId } }: { params: { songId: string } }) {
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
