#!/usr/bin/env node

/**
 * Script para generar noticias automáticas de Taylor Swift
 *
 * Flujo:
 * 1. Buscar noticias recientes de Taylor Swift en NewsAPI
 * 2. Transformar con Gemini AI (tono fan)
 * 3. Descargar y guardar imágenes localmente
 * 4. Actualizar news.json
 */

const fs = require("fs").promises;
const path = require("path");
const https = require("https");
const http = require("http");

// Configuración
const CONFIG = {
  newsapi: {
    baseUrl: "https://newsapi.org/v2",
    apiKey: process.env.NEWSAPI_KEY,
    query: "Taylor Swift",
    language: "en",
    sortBy: "publishedAt",
    pageSize: 5, // Top 5 noticias más recientes
  },
  gemini: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-pro",
  },
  paths: {
    newsJson: path.join(process.cwd(), "src/constants/news.json"),
    imagesDir: path.join(process.cwd(), "public/images/news"),
  },
  maxNews: 50, // Mantener últimas 50 noticias
};

// ============================================================================
// UTILIDADES
// ============================================================================

/** Generar slug único a partir del título */
function generateSlug(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 60) +
    "-" +
    Date.now()
  );
}

/** Descargar imagen y guardar localmente */
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(CONFIG.paths.imagesDir, filename);
    const file = require("fs").createWriteStream(filePath);

    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log(`✅ Image downloaded: ${filename}`);
          resolve(`/images/news/${filename}`);
        });
      })
      .on("error", (err) => {
        require("fs").unlink(filePath, () => {});
        reject(err);
      });
  });
}

/** Hacer request HTTPS */
function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = https.request(requestOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// ============================================================================
// API CALLS
// ============================================================================

/** Buscar noticias en NewsAPI */
async function fetchNews() {
  console.log("🔍 Buscando noticias en NewsAPI...");

  const url =
    `${CONFIG.newsapi.baseUrl}/everything?` +
    `q=${encodeURIComponent(CONFIG.newsapi.query)}&` +
    `language=${CONFIG.newsapi.language}&` +
    `sortBy=${CONFIG.newsapi.sortBy}&` +
    `pageSize=${CONFIG.newsapi.pageSize}&` +
    `apiKey=${CONFIG.newsapi.apiKey}`;

  try {
    const response = await httpsRequest(url);

    if (response.status === "error") {
      throw new Error(response.message);
    }

    console.log(`✅ Encontradas ${response.articles?.length || 0} noticias`);
    return response.articles || [];
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    return [];
  }
}

/** Transformar noticia con Gemini AI */
async function transformWithAI(article) {
  console.log(
    `🤖 Transformando con IA: "${article.title.substring(0, 50)}..."`,
  );

  const prompt = `Eres un periodista musical experto y fan de Taylor Swift. Reescribe esta noticia con un tono cercano, apasionado y personal para fans, pero manteniendo los hechos reales.

REGLAS IMPORTANTES:
- NO inventes información
- Mantén los hechos exactos del artículo original
- Usa un tono entusiasta pero profesional
- Máximo 3 párrafos cortos
- Genera tanto en español como en inglés

Noticia original:
Título: ${article.title}
Contenido: ${article.description || article.content || "Sin descripción"}

Responde SOLO con un JSON válido en este formato exacto (sin markdown, sin backticks):
{
  "title": {
    "es": "Título atractivo en español",
    "en": "Attractive title in English"
  },
  "description": {
    "es": "Descripción de 2-3 párrafos en español",
    "en": "Description in 2-3 paragraphs in English"
  }
}`;

  try {
    const url = `${CONFIG.gemini.baseUrl}/models/${CONFIG.gemini.model}:generateContent?key=${CONFIG.gemini.apiKey}`;

    const response = await httpsRequest(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      },
    });

    const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No response from Gemini");
    }

    // Limpiar markdown si existe
    const cleanText = generatedText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleanText);

    console.log(`✅ Transformación completada`);
    return parsed;
  } catch (error) {
    console.error("❌ Error en transformación IA:", error.message);

    // Fallback: usar texto original
    return {
      title: {
        es: article.title,
        en: article.title,
      },
      description: {
        es:
          article.description ||
          article.content?.substring(0, 300) ||
          "Sin descripción disponible",
        en:
          article.description ||
          article.content?.substring(0, 300) ||
          "No description available",
      },
    };
  }
}

// ============================================================================
// PROCESO PRINCIPAL
// ============================================================================

async function processArticle(rawArticle, existingIds) {
  try {
    // 1. Generar ID único
    const id = generateSlug(rawArticle.title);

    // Verificar si ya existe
    if (existingIds.has(id) || existingIds.has(rawArticle.url)) {
      console.log(
        `⏭️  Noticia duplicada, omitiendo: ${rawArticle.title.substring(0, 50)}`,
      );
      return null;
    }

    // 2. Transformar con IA
    const transformed = await transformWithAI(rawArticle);

    // 3. Manejar imagen
    let imageUrl = null;

    if (rawArticle.urlToImage) {
      try {
        const imageFilename = `${id}.jpg`;
        imageUrl = await downloadImage(rawArticle.urlToImage, imageFilename);
      } catch (error) {
        console.warn(`⚠️  No se pudo descargar imagen: ${error.message}`);
        imageUrl = null; // Usará placeholder
      }
    }

    // 4. Construir objeto NewsArticle
    const newsArticle = {
      id,
      title: transformed.title,
      description: transformed.description,
      imageUrl,
      imageAlt: {
        es: `Imagen de noticia: ${transformed.title.es}`,
        en: `News image: ${transformed.title.en}`,
      },
      publishedDate:
        rawArticle.publishedAt?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      linkUrl: rawArticle.url,
      linkTarget: "_blank",
      commentsActive: false,
    };

    console.log(`✅ Artículo procesado: ${newsArticle.title.es}`);
    return newsArticle;
  } catch (error) {
    console.error(`❌ Error procesando artículo:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Iniciando generación de noticias...\n");

  try {
    // 0. Crear directorio de imágenes si no existe
    await fs.mkdir(CONFIG.paths.imagesDir, { recursive: true });

    // 1. Cargar news.json actual
    let existingNews = [];
    try {
      const content = await fs.readFile(CONFIG.paths.newsJson, "utf-8");
      existingNews = JSON.parse(content);
      console.log(
        `📄 News.json actual tiene ${existingNews.length} artículos\n`,
      );
    } catch (error) {
      console.log("📄 news.json no existe o está vacío, creando nuevo\n");
    }

    // Crear set de IDs existentes para evitar duplicados
    const existingIds = new Set(existingNews.map((n) => n.id));
    const existingUrls = new Set(
      existingNews.map((n) => n.linkUrl).filter(Boolean),
    );
    existingUrls.forEach((url) => existingIds.add(url));

    // 2. Buscar noticias nuevas
    const rawArticles = await fetchNews();

    if (rawArticles.length === 0) {
      console.log("⚠️  No se encontraron noticias nuevas");
      return;
    }

    // 3. Procesar cada artículo
    const newArticles = [];

    for (const rawArticle of rawArticles) {
      const processed = await processArticle(rawArticle, existingIds);

      if (processed) {
        newArticles.push(processed);
        existingIds.add(processed.id);

        // Esperar un poco entre requests para no saturar APIs
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(`\n✅ Procesados ${newArticles.length} nuevos artículos`);

    if (newArticles.length === 0) {
      console.log("ℹ️  No hay artículos nuevos para agregar");
      return;
    }

    // 4. Combinar con existentes y mantener límite
    const allNews = [...newArticles, ...existingNews]
      .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
      .slice(0, CONFIG.maxNews);

    // 5. Guardar news.json actualizado
    await fs.writeFile(
      CONFIG.paths.newsJson,
      JSON.stringify(allNews, null, 2),
      "utf-8",
    );

    console.log(
      `\n✅ news.json actualizado con ${allNews.length} artículos totales`,
    );
    console.log(
      `📊 Nuevos: ${newArticles.length} | Existentes: ${existingNews.length}`,
    );
  } catch (error) {
    console.error("\n❌ Error en proceso principal:", error);
    process.exit(1);
  }
}

// Ejecutar
if (require.main === module) {
  main()
    .then(() => {
      console.log("\n🎉 ¡Proceso completado exitosamente!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Error fatal:", error);
      process.exit(1);
    });
}

module.exports = { main };
