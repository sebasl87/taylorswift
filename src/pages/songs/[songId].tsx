import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import SongDetailPage from "@/components/SongDetailPage";
import { getAllSongs, getSongById } from "@/utils/songs";

interface SongPageProps {
  songId: string;
  songData: {
    title: string;
    album: {
      title: string;
      year: number;
    };
  };
}

export default function SongPage({ songId, songData }: SongPageProps) {
  return (
    <>
      <Head>
        <title>{`${songData.title} | Taylor Swift`}</title>
        <meta name="description" content={`${songData.title} (${songData.album.year}) - ${songData.album.title}`} />
      </Head>
      <SongDetailPage songId={songId} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allSongs = getAllSongs();
  const locales = ['en', 'es'];
  const paths: { params: { songId: string }, locale: string }[] = [];

  allSongs.forEach((song) => {
    locales.forEach((locale) => {
      paths.push({ params: { songId: song.id }, locale });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const songId = params?.songId as string;
  const song = getSongById(songId);

  if (!song) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      songId,
      songData: song,
      messages: (await import(`../../../messages/${locale}.json`)).default
    }
  };
};
