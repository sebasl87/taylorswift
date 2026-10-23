/**
 * Chequea el status code de TODAS las URLs listadas en /sitemap.xml
 * (EN + ES), contra el servidor local.
 *
 * Requiere el server corriendo (npm start o npm run dev) en otra terminal.
 *
 * Uso:
 *   node scripts/check-all-sitemap.mjs
 *   node scripts/check-all-sitemap.mjs --port 3001 --concurrency 2
 */

const args = process.argv.slice(2);
const portIdx = args.indexOf("--port");
const PORT = portIdx !== -1 ? args[portIdx + 1] : "3000";
const BASE = `http://localhost:${PORT}`;

const concIdx = args.indexOf("--concurrency");
const CONCURRENCY = concIdx !== -1 ? parseInt(args[concIdx + 1], 10) : 2;

async function main() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  console.log(`Total URLs a chequear: ${locs.length} (concurrencia: ${CONCURRENCY})\n`);

  let ok = 0;
  const bad = [];
  let idx = 0;

  async function worker() {
    while (idx < locs.length) {
      const i = idx++;
      const url = locs[i].replace("https://taylorswift.com.ar", BASE);
      try {
        const r = await fetch(url, { redirect: "manual" });
        if (r.status === 200) {
          ok++;
        } else {
          bad.push({ url: locs[i], status: r.status });
        }
      } catch (e) {
        bad.push({ url: locs[i], status: `ERROR: ${e.message}` });
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`OK (200): ${ok}`);
  console.log(`Problemas: ${bad.length}`);
  bad.forEach((b) => console.log(`  ${b.status} -> ${b.url}`));
  process.exit(bad.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Error fatal:", e.message);
  process.exit(1);
});
