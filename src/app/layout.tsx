import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { ColorModeProvider } from "@/theme/useColorMode";
import { EraProvider } from "@/context/EraContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const keywordsByLocale = {
    es: [
      "Taylor Swift",
      "The Eras Tour",
      "conciertos",
      "música",
      "pop",
      "country",
      "Argentina",
      "Brasil",
      "Chile",
      "México",
      "Sudamérica",
      "álbumes",
      "discografía",
    ],
    en: [
      "Taylor Swift",
      "The Eras Tour",
      "concerts",
      "music",
      "pop",
      "country",
      "albums",
      "discography",
    ],
  };

  const titleByLocale = {
    es: "Taylor Swift: The Eras Tour, Noticias, Álbumes, Letras y Discografía",
    en: "Taylor Swift: The Eras Tour, News, Albums, Lyrics and Discography",
  };

  const descriptionByLocale = {
    es: "Todo sobre Taylor Swift: The Eras Tour, noticias, discografía, letras y más. Sitio de fans.",
    en: "All about Taylor Swift: The Eras Tour, news, discography, lyrics and more. Fan site.",
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
    authors: [{ name: "Sebastian Loguzzo" }],
    metadataBase: new URL("https://taylorswift.com"),
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      siteName: "Taylor Swift Fan",
      type: "article",
      locale: locale === "es" ? "es_AR" : "en_US",
      publishedTime: "2025-11-01T00:00:00Z",
      modifiedTime: "2026-02-02T00:00:00Z",
      images: [
        {
          url: "/images/meg-argentina.jpg",
          width: 1200,
          height: 630,
          alt: "Megadeth Argentina",
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
    <html lang={locale} className={poppins.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/webp" href="/icon.webp" />
        {/* Schema.org MusicGroup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "Megadeth",
              genre: ["Heavy Metal", "Thrash Metal", "Speed Metal"],
              foundingDate: "1983",
              foundingLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Los Angeles",
                  addressRegion: "CA",
                  addressCountry: "US",
                },
              },
              member: [
                {
                  "@type": "Person",
                  name: "Dave Mustaine",
                  roleName: "Lead Vocals, Rhythm & Lead Guitar",
                },
                {
                  "@type": "Person",
                  name: "James LoMenzo",
                  roleName: "Bass",
                },
                {
                  "@type": "Person",
                  name: "Dirk Verbeuren",
                  roleName: "Drums",
                },
                {
                  "@type": "Person",
                  name: "Teemu Mäntysaari",
                  roleName: "Lead Guitar",
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
                  ? "Taylor Swift es una cantautora estadounidense. Es una de las artistas musicales con mayores ventas del mundo."
                  : "Taylor Swift is an American singer-songwriter. She is one of the world's best-selling music artists.",
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
