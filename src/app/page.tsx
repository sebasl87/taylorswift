import { Metadata } from 'next';
import TaylorHero from "@/components/TaylorHero";

export const metadata: Metadata = {
  title: "Taylor Swift: The Eras Tour, Noticias, Álbumes",
  description:
    "Todo sobre Taylor Swift: The Eras Tour, noticias, discografía, letras y más. El sitio de fans más completo en español e inglés.",
  openGraph: {
    title: "Taylor Swift: The Eras Tour, Noticias, Álbumes",
    description:
      "Todo sobre Taylor Swift: The Eras Tour, noticias, discografía, letras y más.",
    type: "website",
    url: "https://taylorswift.com.ar",
    images: [{ url: "/icon.webp", width: 512, height: 512, alt: "Taylor Swift Fan Site" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taylor Swift: The Eras Tour, Noticias, Álbumes",
    description:
      "Todo sobre Taylor Swift: The Eras Tour, noticias, discografía, letras y más.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
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
              // Description should be localized, but for now hardcoded or passed via props/messages
              // Ideally useTranslations here if client component or getTranslations if server
            }),
          }}
        />
      <TaylorHero />
    </>
  );
}
