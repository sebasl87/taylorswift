import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Playfair_Display, Montserrat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { i18nAlternates } from "@/utils/i18nAlternates";

import ThemeRegistry from "@/theme/ThemeRegistry";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EraProvider } from "@/context/EraContext";
import "@/styles/globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const titleByLocale = {
  es: "Taylor Swift Fan Site | Discografía, Noticias y más",
  en: "Taylor Swift Fan Site | Discography, News & More",
};

const descriptionByLocale = {
  es: "Todo sobre Taylor Swift: discografía, noticias, letras, shows y más. El sitio de fans más completo en español.",
  en: "Everything Taylor Swift: discography, news, lyrics, shows and more. Unofficial fan site in English and Spanish.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  return {
    metadataBase: new URL("https://taylorswift.com.ar"),
    title: {
      default: isEs ? titleByLocale.es : titleByLocale.en,
      template: "%s",
    },
    description: isEs ? descriptionByLocale.es : descriptionByLocale.en,
    keywords: isEs
      ? [
          "Taylor Swift",
          "Taylor Swift fan site",
          "discografía Taylor Swift",
          "letras Taylor Swift",
          "noticias Taylor Swift",
          "Eras Tour",
          "Taylor Swift Argentina",
        ]
      : [
          "Taylor Swift",
          "Taylor Swift fan site",
          "Taylor Swift discography",
          "Taylor Swift lyrics",
          "Taylor Swift news",
          "Eras Tour",
        ],
    icons: {
      icon: "/icon.webp",
    },
    openGraph: {
      type: "website",
      siteName: "Taylor Swift Fan Site",
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? "en_US" : "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      site: "@taylorswift13",
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
    alternates: i18nAlternates("/", locale),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N3K73MS3');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body className={`${playfairDisplay.variable} ${montserrat.variable}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3K73MS3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Script for color mode */}
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
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
          timeZone="America/Argentina/Buenos_Aires"
        >
          <EraProvider>
            <ThemeRegistry>
              <div
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Header />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
                <GoogleAnalytics gaId="G-3MT8DZR057" />
                <Analytics />
              </div>
            </ThemeRegistry>
          </EraProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
