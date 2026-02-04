import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AlbumDetail from "@/components/AlbumDetail";
import discographyData from "@/constants/discography.json";
import liveAlbumsData from "@/constants/liveAlbums.json";
import compilationsData from "@/constants/compilations.json";
import epsData from "@/constants/eps.json";
import type { Album } from "@/types/album";
import { getAlbumDescription } from "@/utils/albumHelpers";

interface Props {
  params: Promise<{
    albumId: string;
  }>;
}

// Función para buscar el álbum por ID en todos los archivos
function getAlbumById(id: string): Album | undefined {
  // Buscar primero en álbumes de estudio
  const studioList = discographyData as unknown as Album[];
  const studioAlbum = studioList.find((album) => album.id === id) as unknown as Album | undefined;
  if (studioAlbum) return studioAlbum;

  // Si no se encuentra, buscar en álbumes en vivo
  const liveList = liveAlbumsData as unknown as Album[];
  const liveAlbum = liveList.find((album) => album.id === id) as unknown as Album | undefined;
  if (liveAlbum) return liveAlbum;

  // Si no se encuentra, buscar en compilaciones
  const compList = compilationsData as unknown as Album[];
  const compilation = compList.find((album) => album.id === id) as unknown as Album | undefined;
  if (compilation) return compilation;

  // Si no se encuentra, buscar en EPs
  const epList = epsData as unknown as Album[];
  const ep = epList.find((album) => album.id === id) as unknown as
    | Album
    | undefined;
  return ep;
}

// Generar metadata dinámico
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const album = getAlbumById(resolvedParams.albumId);

  if (!album) {
    return {
      title: "Álbum no encontrado - Megadeth Fan",
      description: "El álbum que buscas no existe.",
    };
  }

  const albumDescription =
    getAlbumDescription(album, "es", "short") ||
    `Álbum de Megadeth lanzado en ${album.year}.`;

  return {
    title: `${album.title} (${album.year}) - Megadeth Fan`,
    description: `${album.title} - ${albumDescription}`,
    keywords: [
      "Megadeth",
      album.title,
      album.year.toString(),
      "album",
      "thrash metal",
      "metal",
      ...(album.producers || []),
    ],
    openGraph: {
      title: `${album.title} (${album.year})`,
      description: albumDescription,
      images: [
        {
          url: album.cover,
          width: 800,
          height: 800,
          alt: `${album.title} album cover`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Generar rutas estáticas en build time
export async function generateStaticParams() {
  // Combinar álbumes de estudio, en vivo, compilaciones y EPs
  const studioParams = (discographyData as unknown as { id: string }[]).map((album) => ({
    albumId: album.id,
  }));

  const liveParams = (liveAlbumsData as unknown as { id: string }[]).map((album) => ({
    albumId: album.id,
  }));

  const compilationParams = (compilationsData as unknown as { id: string }[]).map((album) => ({
    albumId: album.id,
  }));

  const epParams = (epsData as unknown as { id: string }[]).map((album) => ({
    albumId: album.id,
  }));

  return [...studioParams, ...liveParams, ...compilationParams, ...epParams];
}
export default async function AlbumPage({ params }: Props) {
  const resolvedParams = await params;
  const album = getAlbumById(resolvedParams.albumId);

  if (!album) {
    notFound();
  }

  return <AlbumDetail album={album} />;
}
