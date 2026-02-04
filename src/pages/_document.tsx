import * as React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from "next/document";
import { AppProps } from "next/app";
import { EmotionCache } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "../createEmotionCache";

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: React.JSX.Element[];
}

export default function MyDocument(props: MyDocumentProps) {
  const { emotionStyleTags, locale } = props;
  return (
    <Html lang={locale}>
      <Head>
        <link rel="icon" type="image/webp" href="/icon.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <meta name="emotion-insertion-point" content="" />
        {emotionStyleTags}
      </Head>
      <body>
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
                props.locale === "es"
                  ? "Taylor Swift es una cantautora estadounidense. Es una de las artistas musicales con mayores ventas del mundo."
                  : "Taylor Swift is an American singer-songwriter. She is one of the world's best-selling music artists.",
            }),
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp:
        (
          App: React.ComponentType<AppProps & { emotionCache?: EmotionCache }>,
        ) =>
        (props) => <App emotionCache={cache} {...props} />,
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
