import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import SongDetailPage from "@/components/SongDetailPage";
import songsData from "@/constants/songs.json";

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
  // songData is passed for Metadata purposes mainly
  // SongDetailPage fetches its own data or uses songId? 
  // Wait, SongDetailPage in App Router took songId. 
  // Let's check SongDetailPage implementation.
  // Assuming it takes songId based on previous read.

  return (
    <>
      <Head>
        <title>{`${songData.title} | Taylor Swift`}</title>
        <meta name="description" content={`${songData.title} (${songData.album.year}) - ${songData.album.title}`} />
         {/* More meta tags can be added here based on songData */}
      </Head>
      <SongDetailPage songId={songId} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allSongs = songsData as unknown as { id: string }[];
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
  const list = songsData as unknown as { id: string }[];
  const song = list.find((s) => s.id === songId);

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
