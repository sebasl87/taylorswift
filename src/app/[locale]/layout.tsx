import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Playfair_Display, Montserrat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from 'next';

import ThemeRegistry from '@/theme/ThemeRegistry';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

export const metadata: Metadata = {
  title: "Taylor Swift",
  description: "Taylor Swift Fan Site",
  icons: {
    icon: "/icon.webp",
  },
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!['en', 'es'].includes(locale)) {
    notFound();
  }
 
  // Providing all messages to the client
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body className={`${playfairDisplay.variable} ${montserrat.variable}`}>
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
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="America/Argentina/Buenos_Aires">
          <EraProvider>
            <ThemeRegistry>
              <div
                style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
              >
                <Header />
                <main style={{ flex: 1 }}>
                  {children}
                </main>
                <Footer />
                <GoogleAnalytics gaId="G-3MT8DZR057" />
              </div>
            </ThemeRegistry>
          </EraProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
