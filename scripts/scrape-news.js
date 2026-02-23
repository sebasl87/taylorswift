/**
 * Script de scraping automático de noticias sobre Taylor
 * Ejecutado por GitHub Actions DIARIAMENTE con rotación de feeds
 *
 * Estrategia de rotación:
 * - 2 feeds por día (dentro del límite de 100K tokens/día de Groq)
 * - Feeds top (Blabbermouth, Loudwire, Metal Injection) se procesan 2 veces/semana
 * - Feeds secundarios se procesan 1 vez/semana
 *
 * Flujo:
 * 1. Consume RSS feeds de sitios de metal (2 por día según rotación)
 * 2. Filtra noticias sobre Taylor
 * 3. Procesa con Groq AI (traducción + optimización)
 * 4. Crea noticias vía API
 */

import Parser from "rss-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { processNewsWithAI, isRelevantToTaylor } from "../src/lib/ai.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const API_URL =
  process.env.NEWS_API_URL || "http://localhost:3000/api/news/create";
const API_KEY = process.env.NEWS_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Definición de todos los feeds disponibles
const ALL_FEEDS = {
  // --- FAN SITES CONFIABLES ---
  taylorswiftweb: "https://www.taylorswiftweb.net/feed/",
  swiftagency: "http://theswiftagency.com/feed/",

  // --- INDUSTRIA & PRENSA SERIA ---
  variety: "https://variety.com/feed",
  billboard: "https://www.billboard.com/feed/",
  rollingstone: "https://www.rollingstone.com/music/feed/",

  // --- EXCLUSIVAS Y PR ---
  people: "https://people.com/feed/",

  // --- COMUNIDAD SWIFTIE MODERADA ---
  reddit: "https://www.reddit.com/r/TaylorSwift/top/.rss?t=day",

  // --- GOOGLE NEWS (El radar global) ---
  googlenews:
    "https://news.google.com/rss/search?q=%22Taylor+Swift%22&hl=en-US&gl=US&ceid=US:en",
};

/**
 * Rotación semanal de feeds (2 por día = 14 slots semanales)
 * * Feeds TOP (2 veces/semana): people, googlenews, reddit, billboard, taylorswiftweb, variety
 * Feeds Secundarios (1 vez/semana): rollingstone, swiftagency
 */
const FEED_ROTATION = {
  0: ["people", "taylorswiftweb"], // Domingo: Exclusivas y fandom para cerrar la semana
  1: ["googlenews", "reddit"], // Lunes: Radar global y lo más votado del finde
  2: ["billboard", "variety"], // Martes: Noticias de industria y charts
  3: ["people", "rollingstone"], // Miércoles: Repaso de exclusivas (People 2da vez) + RS
  4: ["googlenews", "taylorswiftweb"], // Jueves: Radar global (2da vez) y fandom (2da vez)
  5: ["reddit", "swiftagency"], // Viernes: Previa del finde en Reddit (2da vez) + Fan site
  6: ["billboard", "variety"], // Sábado: Resumen de industria (2da vez)
};

/**
 * Obtiene los feeds que deben procesarse hoy según el día de la semana
 * @returns {string[]} Array de URLs de feeds para procesar hoy
 */
function getTodaysFeeds() {
  const today = new Date().getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
  const feedKeys = FEED_ROTATION[today];
  const feedUrls = feedKeys.map((key) => ALL_FEEDS[key]);

  console.log(
    `📅 Día de la semana: ${today} (${["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][today]})`,
  );
  console.log(`🎯 Feeds programados: ${feedKeys.join(", ")}`);

  return feedUrls;
}

// RSS Feeds que se procesarán HOY
const RSS_FEEDS = getTodaysFeeds();

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
      ["description", "description"],
    ],
  },
});

/**
 * Extrae el contenido completo de un item del feed
 */
function extractContent(item) {
  return (
    item.contentEncoded ||
    item["content:encoded"] ||
    item.content ||
    item.description ||
    item.summary ||
    ""
  );
}

function isGoogleProxy(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return (
      u.hostname.endsWith("googleusercontent.com") ||
      u.hostname.endsWith("gstatic.com")
    );
  } catch {
    return false;
  }
}

function extractImageInfo(item) {
  if (item.mediaContent && Array.isArray(item.mediaContent)) {
    const image = item.mediaContent.find(
      (m) => m.$ && m.$.url && !isGoogleProxy(m.$.url),
    );
    if (image) return { url: image.$.url, source: "media:content" };
  }

  if (item.mediaThumbnail && Array.isArray(item.mediaThumbnail)) {
    const thumb = item.mediaThumbnail.find(
      (m) => m.$ && m.$.url && !isGoogleProxy(m.$.url),
    );
    if (thumb) return { url: thumb.$.url, source: "media:thumbnail" };
  }

  if (item.enclosure?.url && !isGoogleProxy(item.enclosure.url)) {
    return { url: item.enclosure.url, source: "enclosure" };
  }

  const content = extractContent(item);
  const patterns = [
    /<img[^>]+src=["']([^"'>]+)["']/i,
    /<img[^>]+data-src=["']([^"'>]+)["']/i,
    /<img[^>]+data-lazy-src=["']([^"'>]+)["']/i,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"'>]+)["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"'>]+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1] && !isGoogleProxy(match[1])) {
      return { url: match[1], source: "content" };
    }
  }

  if (item.enclosure?.url) {
    return { url: item.enclosure.url, source: "enclosure-google-proxy" };
  }

  return { url: null, source: "none" };
}

async function fetchOgImage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "TaylorSwiftNewsBot/1.0 (+https://taylorswift.com.ar/news-bot)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"'>]+)["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"'>]+)["']/i,
      /<meta[^>]+name=["']image["'][^>]+content=["']([^"'>]+)["']/i,
      /<img[^>]+class=["'][^"']*(?:thumbnail|featured|main)[^"']*["'][^>]+src=["']([^"'>]+)["']/i,
      /<img[^>]+src=["']([^"'>]+)["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const candidate = match[1];
        if (isGoogleProxy(candidate)) {
          console.log(
            `   ⚠️  Imagen OG/HTML es proxy de Google, descartando: ${candidate}`,
          );
          continue;
        }
        return candidate;
      }
    }

    console.log(
      "   ⚠️  No se encontró imagen OG/HTML válida (no proxy de Google)",
    );
    return null;
  } catch (error) {
    console.log(
      `   ⚠️  Error obteniendo imagen OG desde la fuente: ${error.message}`,
    );
    return null;
  }
}

/**
 * Extrae el ID de video de YouTube del contenido
 */
function extractYouTubeId(item) {
  const content = extractContent(item);
  const link = item.link || "";

  // Combinar contenido y link para buscar
  const text = content + " " + link;

  // Patrones comunes de YouTube
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Genera un ID único basado en el título
 */
function generateId(title) {
  const timestamp = Date.now();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 50);
  return `${slug}-${timestamp}`;
}

/**
 * Limpia el contenido HTML y obtiene texto plano
 */
function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Crea una noticia vía API
 */
/**
 * @returns {'created'|'duplicate'|'error'}
 */
async function createNews(newsData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(newsData),
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.error("❌ Error de conexión: respuesta no es JSON:", text.substring(0, 120));
      return "error";
    }

    if (!response.ok) {
      // 409 = duplicado esperado
      if (response.status === 409) {
        return "duplicate";
      }
      console.error("❌ Error creando noticia:", result.error);
      if (result.validation_errors) {
        result.validation_errors.forEach((err) => {
          console.error(`  • ${err.field}: ${err.message}`);
        });
      }
      return "error";
    }

    return "created";
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    return "error";
  }
}

/**
 * Procesa un feed RSS
 */
async function processFeed(feedUrl) {
  console.log(`\n📡 Procesando feed: ${feedUrl}`);

  try {
    const feed = await parser.parseURL(feedUrl);
    console.log(`   Encontrados ${feed.items.length} items`);

    const relevantNews = [];

    // Filtrar solo los últimos 30 items más recientes (~1 semana)
    const recentItems = feed.items.slice(0, 30);

    for (const item of recentItems) {
      const title = item.title || "";
      const content = stripHtml(extractContent(item));

      // Verificar relevancia
      console.log(`   🔍 Analizando: "${title.substring(0, 60)}..."`);

      const isRelevant = await isRelevantToTaylor(title, content);

      if (isRelevant) {
        console.log(`   ✅ Relevante para Taylor Swift`);
        const imgInfo = extractImageInfo(item);
        if (imgInfo.url) {
          console.log(
            `   🖼️  Imagen detectada (${imgInfo.source}): ${imgInfo.url}`,
          );
        } else {
          console.log(
            `   🖼️  Sin imagen directa, intentando OG desde la fuente...`,
          );
        }
        let image = imgInfo.url;

        if ((!image || isGoogleProxy(image)) && item.link) {
          const og = await fetchOgImage(item.link);
          if (og) {
            image = og;
            console.log(`   🖼️  Imagen OG: ${image}`);
          } else {
            console.log(`   ⚠️  No se encontró imagen OG`);
          }
        }

        if (
          image &&
          typeof image === "string" &&
          !/^https?:\/\//i.test(image)
        ) {
          console.log(`   ⚠️  URL de imagen inválida: ${image}`);
          image = null;
        }

        relevantNews.push({
          title,
          content,
          link: item.link,
          pubDate: item.pubDate,
          image,
          youtubeId: extractYouTubeId(item),
        });
      } else {
        console.log(`   ⏭️  No es relevante`);
      }
    }

    return relevantNews;
  } catch (error) {
    console.error(`❌ Error procesando feed ${feedUrl}:`, error.message);
    return [];
  }
}

/**
 * Script principal
 */
async function main() {
  console.log("╔═══════════════════════════════════════════════╗");
  console.log("║  Taylor News Scraper - Automatización IA   ║");
  console.log("╚═══════════════════════════════════════════════╝\n");

  // Validar configuración
  if (!API_KEY) {
    console.error("❌ ERROR: NEWS_API_KEY no configurada");
    process.exit(1);
  }

  if (!GROQ_API_KEY) {
    console.error("❌ ERROR: GROQ_API_KEY no configurada");
    process.exit(1);
  }

  console.log(`📅 Fecha: ${new Date().toISOString()}`);
  console.log(`🎯 Feeds a procesar: ${RSS_FEEDS.length}\n`);

  let totalFound = 0;
  let totalCreated = 0;
  let totalDuplicates = 0;
  let totalErrors = 0;

  // Procesar todos los feeds
  for (const feedUrl of RSS_FEEDS) {
    const relevantNews = await processFeed(feedUrl);
    totalFound += relevantNews.length;

    // Procesar cada noticia relevante con delay para respetar rate limit
    for (let i = 0; i < relevantNews.length; i++) {
      const news = relevantNews[i];

      // Delay de 8 segundos entre noticias (Groq free tier: 30 RPM)
      if (i > 0) {
        console.log(
          `\n⏱️  Esperando 8 segundos para respetar rate limit de Groq...`,
        );
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }

      console.log(
        `\n🤖 Procesando con Groq AI [${i + 1}/${relevantNews.length}]: "${news.title.substring(0, 60)}..."`,
      );

      try {
        // Procesar con AI
        const processed = await processNewsWithAI(
          news.title,
          news.content,
          news.link,
        );

        // Preparar datos para la API
        const newsData = {
          id: generateId(processed.title_en),
          title_es: processed.title_es,
          title_en: processed.title_en,
          description_es: processed.description_es,
          description_en: processed.description_en,
          // Usar fecha real del artículo o fecha actual como fallback
          published_date: news.pubDate
            ? new Date(news.pubDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          image_url: news.image || "/images/band.webp",
          image_alt_es: processed.title_es,
          image_alt_en: processed.title_en,
          image_caption_es: processed.image_caption_es,
          image_caption_en: processed.image_caption_en,
          source_url: news.link,
          is_automated: true,
          comments_active: true,
          ...(news.youtubeId && { youtube_video_id: news.youtubeId }),
        };

        console.log(`   📝 Título EN: ${processed.title_en}`);
        console.log(`   📝 Título ES: ${processed.title_es}`);
        console.log(`   🖼️  Enviando imagen: ${newsData.image_url}`);

        // Crear noticia
        const result = await createNews(newsData);

        if (result === "created") {
          console.log(`   ✅ Noticia creada exitosamente`);
          totalCreated++;
        } else if (result === "duplicate") {
          console.log(`   ⏭️  Duplicada, omitiendo`);
          totalDuplicates++;
        } else {
          console.log(`   ❌ Error al crear noticia`);
          totalErrors++;
        }

        // Pausa para no saturar la API
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(
          `   ❌ Error en Groq AI: Noticia descartada - ${error.message}`,
        );
        console.log(
          `   ℹ️  Esta noticia NO se guardará (solo contenido correctamente procesado)`,
        );
        totalErrors++;
      }
    }
  }

  // Resumen final
  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║              RESUMEN DE EJECUCIÓN             ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log(`📊 Noticias relevantes encontradas: ${totalFound}`);
  console.log(`✅ Noticias creadas exitosamente:   ${totalCreated}`);
  console.log(`⏭️  Duplicadas omitidas:             ${totalDuplicates}`);
  console.log(`❌ Errores:                          ${totalErrors}`);
  console.log(`\n🎉 Proceso completado a las ${new Date().toLocaleString()}`);

  // Fallar el Action si hubo errores reales y no se creó ninguna noticia
  if (totalErrors > 0 && totalCreated === 0 && totalFound > 0) {
    console.error(`\n💥 FALLO: Se encontraron ${totalFound} noticias pero ninguna pudo crearse (${totalErrors} errores). Revisar API o credenciales.`);
    process.exit(1);
  }
}

// Ejecutar
main().catch((error) => {
  console.error("💥 Error fatal:", error);
  process.exit(1);
});
