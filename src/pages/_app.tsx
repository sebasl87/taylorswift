import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { Playfair_Display, Montserrat } from "next/font/google";
import "../styles/globals.css";

import createEmotionCache from "../createEmotionCache";
import { makeTheme } from "@/theme/createTheme";
import { EraProvider, useEra } from "@/context/EraContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

// Configuración de fuentes
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

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function InnerApp({ Component, pageProps }: MyAppProps) {
  const { currentEra } = useEra();

  const theme = React.useMemo(() => makeTheme(currentEra), [currentEra]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        className={`${playfairDisplay.variable} ${montserrat.variable}`}
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>
        <Footer />
        <GoogleAnalytics gaId="G-3MT8DZR057" />
      </div>
    </ThemeProvider>
  );
}

export default function MyApp(props: MyAppProps) {
  const { emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();

  return (
    <CacheProvider value={emotionCache}>
      <NextIntlClientProvider
        locale={router.locale}
        messages={pageProps.messages}
        timeZone="America/Argentina/Buenos_Aires"
      >
        <EraProvider>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <InnerApp {...props} />
        </EraProvider>
      </NextIntlClientProvider>
    </CacheProvider>
  );
}
