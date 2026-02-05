import { GetStaticProps, GetStaticPaths } from "next";
import Head from 'next/head';
import AlbumDetail from "@/components/AlbumDetail";
import discographyData from "@/constants/discography.json";
import liveAlbumsData from "@/constants/liveAlbums.json";
import compilationsData from "@/constants/compilations.json";
import epsData from "@/constants/eps.json";
import type { Album } from "@/types/album";
import { getAlbumDescription } from "@/utils/albumHelpers";

interface AlbumPageProps {
  album: Album;
}

// Función para buscar el álbum por ID en todos los archivos (reused)
function getAlbumById(id: string): Album | undefined {
  // Buscar primero en álbumes de estudio
  const studioList = discographyData as unknown as Album[];
  const studioAlbum = studioList.find((album) => album.id === id) as unknown as
    | Album
    | undefined;
  if (studioAlbum) return studioAlbum;

  // Si no se encuentra, buscar en álbumes en vivo
  const liveList = liveAlbumsData as unknown as Album[];
  const liveAlbum = liveList.find((album) => album.id === id) as unknown as
    | Album
    | undefined;
  if (liveAlbum) return liveAlbum;

  // Si no se encuentra, buscar en compilaciones
  const compList = compilationsData as unknown as Album[];
  const compilation = compList.find((album) => album.id === id) as unknown as
    | Album
    | undefined;
  if (compilation) return compilation;

  // Si no se encuentra, buscar en EPs
  const epList = epsData as unknown as Album[];
  const ep = epList.find((album) => album.id === id) as unknown as
    | Album
    | undefined;
  return ep;
}

export default function AlbumPage({ album }: AlbumPageProps) {
  // We can't use useTranslations in metadata in Pages Router easily without passing it or using it inside component for Head
  // But for Head we can just use the data we have

  const albumDescription =
    getAlbumDescription(album, "es", "short") || // Defaulting to ES for metadata if locale not easily accessible or use logic below
    `Álbum de Taylor Swift lanzado en ${album.year}.`;
  // Note: Original code hardcoded "Megadeth Fan" in title, probably a copy-paste error in source.
  // I will fix it to Taylor Swift as per context.

  return (
    <>
      <Head>
        <title>{`${album.title} (${album.year}) - Taylor Swift Fan`}</title>
        <meta
          name="description"
          content={`${album.title} - ${albumDescription}`}
        />
        <meta property="og:title" content={`${album.title} (${album.year})`} />
        <meta property="og:description" content={albumDescription} />
        <meta property="og:image" content={album.cover} />
        {/* Add keywords etc */}
      </Head>
      <AlbumDetail album={album} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allAlbums: { id: string }[] = [
    ...(discographyData as unknown as { id: string }[]),
    ...(liveAlbumsData as unknown as { id: string }[]),
    ...(compilationsData as unknown as { id: string }[]),
    ...(epsData as unknown as { id: string }[]),
  ];

  const locales = ["en", "es"];
  const paths: { params: { albumId: string }; locale: string }[] = [];

  allAlbums.forEach((album) => {
    locales.forEach((locale) => {
      paths.push({ params: { albumId: album.id }, locale });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const albumId = params?.albumId as string;
  const album = getAlbumById(albumId);

  if (!album) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      album,
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
};
