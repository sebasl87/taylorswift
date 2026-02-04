import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { ColorModeProvider } from "@/theme/useColorMode";
import { EraProvider } from "@/context/EraContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const keywordsByLocale = {
    es: [
      "Taylor Swift",
      "Fearless",
      "1989",
      "Folklore",
      "Evermore",
      "Midnights",
      "Taylor's Version",
      "discografía Taylor Swift",
      "biografía Taylor Swift",
      "noticias Taylor Swift",
      "conciertos Taylor Swift",
      "pop",
      "country",
      "folk",
      "Estados Unidos",
      "álbumes",
      "actualizaciones",
      "fotos",
      "videos",
      "tienda oficial",
      "merchandising",
      "playlist Spotify",
    ],
    en: [
      "Taylor Swift",
      "Fearless",
      "1989",
      "Folklore",
      "Evermore",
      "Midnights",
      "Taylor's Version",
      "Taylor Swift discography",
      "Taylor Swift biography",
      "Taylor Swift news",
      "Taylor Swift concerts",
      "pop",
      "country",
      "folk",
      "albums",
      "updates",
      "photos",
      "videos",
      "official store",
      "merchandise",
      "Spotify playlist",
    ],
  };

  const titleByLocale = {
    es: "Taylor Swift: Discografía, biografía, noticias, fotos, videos, tienda y playlists",
    en: "Taylor Swift: Discography, biography, news, photos, videos, store and playlists",
  };

  const descriptionByLocale = {
    es: "Sitio completo dedicado a Taylor Swift: discografía cronológica (incluyendo Taylor's Version), biografía detallada, noticias y eventos, galería de fotos, tienda oficial, reproductor de música con playlists, y diseño elegante pastel/vintage. Fan site no oficial.",
    en: "Complete site dedicated to Taylor Swift: chronological discography (including Taylor's Version), detailed biography, news and events, photo gallery, official store, music player with curated playlists, and elegant pastel/vintage design. Unofficial fan site.",
  };

  return {
    title:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description:
      descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
      descriptionByLocale.es,
    keywords:
      keywordsByLocale[locale as keyof typeof keywordsByLocale] ||
      keywordsByLocale.es,
    authors: [{ name: "Taylor Fans" }],
    metadataBase: new URL("https://taylorswift.example.com"),
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      siteName: "Taylor Swift Fan",
      type: "article",
      locale: locale === "es" ? "es_AR" : "en_US",
      publishedTime: "2026-02-04T00:00:00Z",
      modifiedTime: "2026-02-04T00:00:00Z",
      images: [
        {
          url: "/images/taylor-cover.jpg",
          width: 1200,
          height: 630,
          alt: "Taylor Swift",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/webp" href="/icon.webp" />
        {/* Schema.org Person (Taylor Swift) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Taylor Swift",
              genre: ["Pop", "Country", "Folk"],
              birthDate: "1989-12-13",
              birthPlace: {
                "@type": "Place",
                name: "Reading, Pennsylvania, US",
              },
              url: "https://taylorswift.example.com",
              sameAs: [
                "https://www.facebook.com/TaylorSwift",
                "https://twitter.com/taylorswift13",
                "https://www.instagram.com/taylorswift",
                "https://www.youtube.com/taylorswift",
                "https://en.wikipedia.org/wiki/Taylor_Swift",
              ],
              description:
                locale === "es"
                  ? "Taylor Swift es una artista estadounidense que evolucionó del country al pop y folk, con una discografía aclamada que incluye sus Taylor's Version."
                  : "Taylor Swift is an American artist who evolved from country to pop and folk, with an acclaimed discography including her Taylor's Version releases.",
            }),
          }}
        />

        {/* Preconnect a recursos externos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />

        {/* Script para inicializar color mode antes de hidratar React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('color-mode');
                  if (!mode) {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      mode = 'dark';
                    } else {
                      mode = 'light';
                    }
                  }
                  document.documentElement.setAttribute('data-color-mode', mode);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <EraProvider>
            <ColorModeProvider>
              <ThemeRegistry>
                <Header />
                <main style={{ flex: 1 }}>
                  {children}
                  <GoogleAnalytics gaId="G-3MT8DZR057" />
                </main>
                <Footer />
              </ThemeRegistry>
            </ColorModeProvider>
          </EraProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
