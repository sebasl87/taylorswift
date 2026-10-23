import { Metadata } from 'next';
import TaylorHero from "@/components/TaylorHero";
import { i18nAlternates } from "@/utils/i18nAlternates";
import { absoluteUrl } from "@/utils/absoluteUrl";

const homeMeta = {
  es: {
    title: "Taylor Swift: The Eras Tour, Noticias, Álbumes",
    description:
      "Todo sobre Taylor Swift: The Eras Tour, noticias, discografía, letras y más. El sitio de fans más completo en español e inglés.",
  },
  en: {
    title: "Taylor Swift: The Eras Tour, News, Albums & Lyrics",
    description:
      "Everything Taylor Swift: The Eras Tour, daily news, full discography, lyrics, shows and more. Unofficial fan site in English and Spanish.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "es" ? homeMeta.es : homeMeta.en;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: absoluteUrl("/", locale),
      locale: locale === "es" ? "es_AR" : "en_US",
      images: [{ url: "/icon.webp", width: 512, height: 512, alt: "Taylor Swift Fan Site" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    alternates: i18nAlternates("/", locale),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "Taylor Swift",
              genre: ["Pop", "Country", "Alternative"],
              foundingDate: "2006",
              foundingLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "West Reading",
                  addressRegion: "PA",
                  addressCountry: "US",
                },
              },
              member: [
                {
                  "@type": "Person",
                  name: "Taylor Swift",
                  roleName: "Vocals, Guitar, Piano",
                },
              ],
              url: "https://taylorswift.com",
              sameAs: [
                "https://www.facebook.com/TaylorSwift",
                "https://twitter.com/taylorswift13",
                "https://www.instagram.com/taylorswift",
                "https://www.youtube.com/taylorswift",
                "https://en.wikipedia.org/wiki/Taylor_Swift",
              ],
              description:
                locale === "es"
                  ? "Taylor Swift es una cantautora estadounidense nacida en 1989 en West Reading, Pensilvania. Con 12 álbumes de estudio y The Eras Tour, la gira más taquillera de la historia, es una de las artistas más influyentes de su generación."
                  : "Taylor Swift is an American singer-songwriter born in 1989 in West Reading, Pennsylvania. With 12 studio albums and The Eras Tour, the highest-grossing tour of all time, she is one of the most influential artists of her generation.",
            }),
          }}
        />
      <TaylorHero />
    </>
  );
}
