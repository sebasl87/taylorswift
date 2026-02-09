import { Metadata } from "next";
import AlbumDetail from "@/components/AlbumDetail";
import discographyData from "@/constants/discography.json";
import liveAlbumsData from "@/constants/liveAlbums.json";
import compilationsData from "@/constants/compilations.json";
import epsData from "@/constants/eps.json";
import type { Album } from "@/types/album";
import { getAlbumDescription } from "@/utils/albumHelpers";

function getAlbumById(id: string): Album | undefined {
  const studioList = discographyData as unknown as Album[];
  const studioAlbum = studioList.find((album) => album.id === id);
  if (studioAlbum) return studioAlbum;

  const liveList = liveAlbumsData as unknown as Album[];
  const liveAlbum = liveList.find((album) => album.id === id);
  if (liveAlbum) return liveAlbum;

  const compList = compilationsData as unknown as Album[];
  const compilation = compList.find((album) => album.id === id);
  if (compilation) return compilation;

  const epList = epsData as unknown as Album[];
  const ep = epList.find((album) => album.id === id);
  return ep;
}

export async function generateStaticParams() {
  const allAlbums: { id: string }[] = [
    ...(discographyData as unknown as { id: string }[]),
    ...(liveAlbumsData as unknown as { id: string }[]),
    ...(compilationsData as unknown as { id: string }[]),
    ...(epsData as unknown as { id: string }[]),
  ];

  return allAlbums.map((album) => ({
    albumId: album.id,
  }));
}

export async function generateMetadata({ params: { albumId, locale } }: { params: { albumId: string, locale: string } }): Promise<Metadata> {
  const album = getAlbumById(albumId);
  if (!album) return { title: "Album Not Found" };

  const albumDescription =
    getAlbumDescription(album, locale as "en" | "es", "short") ||
    `Taylor Swift Album ${album.year}`;

  return {
    title: `${album.title} (${album.year}) - Taylor Swift Fan`,
    description: `${album.title} - ${albumDescription}`,
    openGraph: {
        title: `${album.title} (${album.year})`,
        description: albumDescription,
        images: [album.cover],
    }
  };
}

export default function AlbumPage({ params: { albumId } }: { params: { albumId: string } }) {
  const album = getAlbumById(albumId);

  if (!album) {
    return <div>Album not found</div>;
  }

  return (
    <>
      <AlbumDetail album={album} />
    </>
  );
}
