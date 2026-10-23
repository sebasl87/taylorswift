import { MetadataRoute } from "next";

// Crawlers de IA: rastrean el sitio entero para entrenar modelos y no traen
// visitas. En megadeth.com.ar (mismo stack) meta-externalagent llegó a ser el
// 58% del tráfico y disparaba el optimizador de imágenes. Googlebot, Bingbot
// y facebookexternalhit (las previews de Facebook e Instagram) NO están en
// esta lista y siguen entrando normalmente.
const AI_CRAWLERS = [
  "meta-externalagent",
  "meta-webindexer",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "CCBot",
  "PerplexityBot",
  "Bytespider",
  "Amazonbot",
  "Applebot-Extended",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /_next/ NO se bloquea: Google necesita el CSS/JS para renderizar.
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: "https://taylorswift.com.ar/sitemap.xml",
  };
}
