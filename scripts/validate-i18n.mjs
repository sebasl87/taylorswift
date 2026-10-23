/**
 * Valida las rutas migradas a next-intl (Fases 1-3 del plan de i18n):
 * - status 200 en la versión EN (sin prefijo) y ES (/es/...)
 * - <html lang="en"> en la versión EN y <html lang="es"> en la versión ES
 * - hreflang recíproco: en -> ruta EN, es -> ruta ES, x-default -> ruta EN,
 *   idéntico en ambas versiones de la página.
 *
 * Las rutas dinámicas se sacan de /sitemap.xml (un ejemplo real por
 * categoría), así se valida contra datos reales sin reimplementar cada
 * función de slug (songs, bootlegs, entrevistas, etc.)
 *
 * Requiere el server corriendo (npm run dev o npm start) en otra terminal.
 *
 * Uso:
 *   node scripts/validate-i18n.mjs
 *   node scripts/validate-i18n.mjs --port 3001
 */

const args = process.argv.slice(2);
const portIdx = args.indexOf("--port");
const PORT = portIdx !== -1 ? args[portIdx + 1] : "3000";
const BASE = `http://localhost:${PORT}`;

// Páginas estáticas (calcadas de la lista `pages` en src/app/sitemap.ts).
const staticPaths = [
  "/",
  "/discography",
  "/songs",
  "/noticias",
  "/videos",
  "/shows",
  "/tour",
  "/era",
  "/entrevistas",
  "/bootlegs",
  "/faq",
  "/contacto",
  "/privacidad",
  "/terminos",
];

function firstDynamicSample(paths, prefix, exclude = []) {
  return paths.find(
    (p) =>
      p.startsWith(prefix) &&
      p !== prefix.replace(/\/$/, "") &&
      !exclude.some((ex) => p.startsWith(ex)),
  );
}

async function getSitemapPaths() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

function getDynamicPaths(paths) {
  const dynamicPrefixes = [
    ["/songs/"],
    ["/videos/"],
    ["/discography/"],
    ["/era/"],
    ["/entrevistas/"],
    ["/shows/"],
    ["/bootlegs/"],
    ["/noticias/"],
  ];

  return dynamicPrefixes
    .map(([prefix, exclude]) => firstDynamicSample(paths, prefix, exclude))
    .filter(Boolean);
}

function extractHtmlLang(html) {
  const match = html.match(/<html[^>]*\slang="([^"]+)"/);
  return match ? match[1] : null;
}

function extractHreflangs(html) {
  const matches = [
    ...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g),
  ];
  const map = {};
  matches.forEach(([, lang, href]) => (map[lang] = href));
  return map;
}

async function checkPath(pathname) {
  const enUrl = `${BASE}${pathname}`;
  const esUrl = `${BASE}/es${pathname}`;
  const issues = [];

  let enRes, esRes, enHtml, esHtml;
  try {
    enRes = await fetch(enUrl);
    enHtml = await enRes.text();
  } catch (e) {
    return { pathname, ok: false, issues: [`EN no responde: ${e.message}`] };
  }
  try {
    esRes = await fetch(esUrl);
    esHtml = await esRes.text();
  } catch (e) {
    return { pathname, ok: false, issues: [`ES no responde: ${e.message}`] };
  }

  if (enRes.status !== 200) issues.push(`EN status ${enRes.status} (esperado 200)`);
  if (esRes.status !== 200) issues.push(`ES status ${esRes.status} (esperado 200)`);

  const enLang = extractHtmlLang(enHtml);
  const esLang = extractHtmlLang(esHtml);
  if (enLang !== "en") issues.push(`[EN page] <html lang="${enLang ?? "FALTA"}">, esperado "en"`);
  if (esLang !== "es") issues.push(`[ES page] <html lang="${esLang ?? "FALTA"}">, esperado "es"`);

  const enHreflangs = extractHreflangs(enHtml);
  const esHreflangs = extractHreflangs(esHtml);

  const expectedEn = pathname === "/" ? "https://taylorswift.com.ar" : `https://taylorswift.com.ar${pathname}`;
  const expectedEs = pathname === "/" ? "https://taylorswift.com.ar/es" : `https://taylorswift.com.ar/es${pathname}`;

  [
    ["en", expectedEn, enHreflangs, "EN"],
    ["es", expectedEs, enHreflangs, "EN"],
    ["x-default", expectedEn, enHreflangs, "EN"],
  ].forEach(([lang, expected, map, label]) => {
    if (map[lang] !== expected) {
      issues.push(`[${label} page] hreflang="${lang}" es "${map[lang] ?? "FALTA"}", esperado "${expected}"`);
    }
  });

  [
    ["en", expectedEn, esHreflangs, "ES"],
    ["es", expectedEs, esHreflangs, "ES"],
    ["x-default", expectedEn, esHreflangs, "ES"],
  ].forEach(([lang, expected, map, label]) => {
    if (map[lang] !== expected) {
      issues.push(`[${label} page] hreflang="${lang}" es "${map[lang] ?? "FALTA"}", esperado "${expected}"`);
    }
  });

  return { pathname, ok: issues.length === 0, issues };
}

async function main() {
  console.log(`Validando contra ${BASE} ...\n`);

  const sitemapPaths = await getSitemapPaths();
  const allPaths = [...staticPaths, ...getDynamicPaths(sitemapPaths)];

  let okCount = 0;
  let failCount = 0;

  for (const p of allPaths) {
    const result = await checkPath(p);
    if (result.ok) {
      console.log(`✅ ${p}`);
      okCount++;
    } else {
      console.log(`❌ ${p}`);
      result.issues.forEach((issue) => console.log(`   - ${issue}`));
      failCount++;
    }
  }

  console.log(`\n${okCount} OK / ${failCount} con problemas / ${allPaths.length} total`);
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Error fatal:", e.message);
  process.exit(1);
});
