import { getLocale } from "next-intl/server";
import SongsListPage from "@/components/SongsListPage";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import { i18nAlternates } from "@/utils/i18nAlternates";
import { absoluteUrl } from "@/utils/absoluteUrl";
import type { Metadata } from "next";

const songsMeta = {
  es: {
    title: "Todas las Canciones de Taylor Swift por Álbum",
    description:
      "Listado completo de las canciones de Taylor Swift ordenadas por álbum, de Taylor Swift (2006) a The Life of a Showgirl: letras, compositores y duración de cada tema.",
  },
  en: {
    title: "All Taylor Swift Songs by Album",
    description:
      "Complete list of Taylor Swift songs sorted by album, from Taylor Swift (2006) to The Life of a Showgirl: lyrics, songwriters and length of every track.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = locale === "es" ? songsMeta.es : songsMeta.en;
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: absoluteUrl("/songs", locale),
    },
    alternates: i18nAlternates("/songs", locale),
  };
}

export default function SongsPage() {
  return (
    <ContainerGradientNoPadding>
      <SongsListPage />
    </ContainerGradientNoPadding>
  );
}
