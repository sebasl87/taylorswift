/**
 * Generador de sitemap.xml estático para public/
 * Cubre TODAS las rutas del sitio: estáticas + dinámicas (álbumes, canciones,
 * shows, entrevistas, bootlegs, capítulos de historia y noticias de Supabase)
 *
 * Uso:
 *   node scripts/generate-sitemap.js
 *   npx tsx scripts/generate-sitemap.js
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Cargar variables de entorno
dotenv.config({ path: resolve(ROOT, ".env") });

const BASE_URL = "https://taylorswift.com.ar";
const NOW = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// ---------------------------------------------------------------------------
// Helpers de slug (replicando src/utils/slugify.ts y los helpers de tipos)
// ---------------------------------------------------------------------------
function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/ /g, "-")
    .replace(/--+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateInterviewSlug(id) {
  return id
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ---------------------------------------------------------------------------
// Carga de datos estáticos
// ---------------------------------------------------------------------------
function loadJson(relPath) {
  return JSON.parse(readFileSync(resolve(ROOT, relPath), "utf-8"));
}

const discography   = loadJson("src/constants/discography.json");
const liveAlbums    = loadJson("src/constants/liveAlbums.json");
const compilations  = loadJson("src/constants/compilations.json");
const eps           = loadJson("src/constants/eps.json");
const shows         = loadJson("src/constants/shows.json");
const interviews    = loadJson("src/constants/interviews.json");
const bootlegs      = loadJson("src/constants/bootlegs.json");
const historia      = loadJson("src/constants/historia.json");

// ---------------------------------------------------------------------------
// Noticias desde Supabase
// ---------------------------------------------------------------------------
async function fetchNewsIds() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("⚠️  Sin credenciales de Supabase, noticias omitidas del sitemap");
    return [];
  }

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("news_articles_with_links")
      .select("id, published_date")
      .order("published_date", { ascending: false });

    if (error) throw error;
    console.log(`   ✅ ${data.length} noticias obtenidas de Supabase`);
    return data;
  } catch (err) {
    console.warn("⚠️  Error consultando Supabase:", err.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Builders de entradas
// ---------------------------------------------------------------------------
function entry(url, lastmod, changefreq, priority) {
  return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// ---------------------------------------------------------------------------
// Construcción del sitemap
// ---------------------------------------------------------------------------
async function buildSitemap() {
  console.log("🗺️  Generando sitemap.xml estático…\n");

  const urls = [];

  // ── Páginas estáticas ──────────────────────────────────────────────────
  const statics = [
    { path: "/",           freq: "weekly",  pri: "1.0" },
    { path: "/discography",freq: "monthly", pri: "0.9" },
    { path: "/songs",      freq: "monthly", pri: "0.9" },
    { path: "/noticias",   freq: "daily",   pri: "0.9" },
    { path: "/videos",     freq: "monthly", pri: "0.8" },
    { path: "/shows",      freq: "weekly",  pri: "0.8" },
    { path: "/tour",       freq: "weekly",  pri: "0.8" },
    { path: "/era",        freq: "monthly", pri: "0.8" },
    { path: "/entrevistas",freq: "monthly", pri: "0.7" },
    { path: "/bootlegs",   freq: "monthly", pri: "0.6" },
    { path: "/faq",        freq: "yearly",  pri: "0.5" },
    { path: "/contacto",   freq: "yearly",  pri: "0.4" },
    { path: "/privacidad", freq: "yearly",  pri: "0.3" },
    { path: "/terminos",   freq: "yearly",  pri: "0.3" },
  ];

  for (const s of statics) {
    urls.push(entry(`${BASE_URL}${s.path}`, NOW, s.freq, s.pri));
  }
  console.log(`📄 Páginas estáticas:       ${statics.length}`);

  // ── Álbumes ───────────────────────────────────────────────────────────
  const allAlbums = [...discography, ...liveAlbums, ...compilations, ...eps];
  for (const album of allAlbums) {
    urls.push(entry(`${BASE_URL}/discography/${album.id}`, NOW, "monthly", "0.8"));
  }
  console.log(`💿 Álbumes:                 ${allAlbums.length}`);

  // ── Canciones ─────────────────────────────────────────────────────────
  let songCount = 0;
  for (const album of discography) {
    for (const track of album.tracks) {
      const id = slugify(track.title);
      urls.push(entry(`${BASE_URL}/songs/${id}`, NOW, "monthly", "0.7"));
      songCount++;
    }
  }
  console.log(`🎵 Canciones:               ${songCount}`);

  // ── Shows ─────────────────────────────────────────────────────────────
  for (const show of shows) {
    urls.push(entry(`${BASE_URL}/shows/${show.id}`, NOW, "yearly", "0.6"));
  }
  console.log(`🎤 Shows:                   ${shows.length}`);

  // ── Entrevistas ───────────────────────────────────────────────────────
  for (const interview of interviews) {
    const slug = generateInterviewSlug(interview.id);
    urls.push(entry(`${BASE_URL}/entrevistas/${slug}`, NOW, "yearly", "0.6"));
  }
  console.log(`🎙️  Entrevistas:             ${interviews.length}`);

  // ── Bootlegs ──────────────────────────────────────────────────────────
  for (const bootleg of bootlegs) {
    urls.push(entry(`${BASE_URL}/bootlegs/${bootleg.id}`, NOW, "yearly", "0.5"));
  }
  console.log(`📼 Bootlegs:                ${bootlegs.length}`);

  // ── Historia / Eras ───────────────────────────────────────────────────
  for (const chapter of historia.chapters) {
    urls.push(entry(`${BASE_URL}/era/${chapter.slug}`, NOW, "monthly", "0.7"));
  }
  console.log(`🌟 Capítulos de historia:   ${historia.chapters.length}`);

  // ── Noticias (Supabase) ───────────────────────────────────────────────
  const news = await fetchNewsIds();
  for (const article of news) {
    const lastmod = article.published_date
      ? article.published_date.split("T")[0]
      : NOW;
    urls.push(entry(`${BASE_URL}/noticias/${article.id}`, lastmod, "yearly", "0.6"));
  }
  console.log(`📰 Noticias (Supabase):     ${news.length}`);

  // ── XML final ─────────────────────────────────────────────────────────
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
    '          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    "",
    ...urls,
    "",
    "</urlset>",
  ].join("\n");

  const outPath = resolve(ROOT, "public", "sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");

  const total = urls.length;
  console.log(`\n✅ sitemap.xml generado → public/sitemap.xml`);
  console.log(`   Total URLs: ${total}`);
  console.log(`   Fecha:      ${NOW}`);
}

buildSitemap().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});
