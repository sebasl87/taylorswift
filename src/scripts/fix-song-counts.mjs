#!/usr/bin/env node
import fs from "node:fs";

const inputPath = process.argv[2] || "songs.counts.json";
const outputPath = process.argv[3] || "songs.counts.fixed.json";
const reportPath = process.argv[4] || "songs.counts.report.json";

/**
 * Pass B: normalización “segura” (sin inventar nombres)
 */
function normalizeTitle(raw) {
  if (typeof raw !== "string") return "";
  let s = raw.normalize("NFKC");

  // apóstrofes/quotes curvas -> simples
  s = s.replace(/[’‘´`]/g, "'");

  // comillas curvas -> dobles
  s = s.replace(/[“”]/g, '"');

  // ellipsis unicode -> tres puntos
  s = s.replace(/…/g, "...");

  // espacios raros -> espacio normal
  s = s.replace(/\u00A0/g, " ");

  // colapsar espacios múltiples
  s = s.replace(/\s+/g, " ").trim();

  return s;
}

/**
 * Key canónica para merge: case-insensitive + normalizado
 * Ojo: NO removemos puntuación para no mezclar temas distintos.
 */
function canonicalKey(title) {
  return normalizeTitle(title).toLowerCase();
}

/**
 * Elegimos el “mejor” display name entre variantes.
 * Heurística simple: preferimos el que tenga:
 * - apóstrofes (') vs sin
 * - mayúsculas “reales” (no todo lower)
 * - longitud mayor (suele ser más “completa”)
 */
function pickBestDisplayName(a, b) {
  const score = (x) => {
    const s = normalizeTitle(x);
    const hasApostrophe = s.includes("'") ? 2 : 0;
    const hasUpper = /[A-ZÁÉÍÓÚÜÑ]/.test(s) ? 1 : 0;
    const len = Math.min(s.length, 80) / 80; // 0..1
    return hasApostrophe + hasUpper + len;
  };
  return score(b) > score(a) ? b : a;
}

/**
 * Pass A: split solo con " / " (con espacios)
 */
function splitMedleyIfNeeded(title) {
  // Solo splitteamos exactamente " / " (con espacios)
  if (!title.includes(" / ")) return [title];

  return title
    .split(" / ")
    .map((p) => normalizeTitle(p))
    .filter(Boolean);
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`No existe el archivo: ${inputPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, "utf-8");
  const data = JSON.parse(raw);

  // Acumulador final: canonicalKey -> { displayName, count }
  const acc = new Map();

  const report = {
    inputPath,
    outputPath,
    reportPath,
    medleysExpanded: [], // { originalKey, count, parts }
    merges: [], // { canonicalKey, chosenDisplay, variants: [{name,count}] }
    notes: [],
  };

  // Para reporte de variantes por canonical
  const variantsByCanonical = new Map();

  for (const [rawKey, rawCount] of Object.entries(data)) {
    const count = Number(rawCount) || 0;
    if (count <= 0) continue;

    const cleanedKey = normalizeTitle(rawKey);
    if (!cleanedKey) continue;

    const parts = splitMedleyIfNeeded(cleanedKey);

    if (parts.length > 1) {
      report.medleysExpanded.push({
        originalKey: cleanedKey,
        count,
        parts,
      });
    }

    for (const part of parts) {
      const displayCandidate = normalizeTitle(part);
      const ck = canonicalKey(displayCandidate);

      // track variantes
      const v = variantsByCanonical.get(ck) || [];
      v.push({ name: displayCandidate, count });
      variantsByCanonical.set(ck, v);

      // acumular
      const prev = acc.get(ck);
      if (!prev) {
        acc.set(ck, { displayName: displayCandidate, count });
      } else {
        prev.count += count;
        prev.displayName = pickBestDisplayName(
          prev.displayName,
          displayCandidate
        );
        acc.set(ck, prev);
      }
    }
  }

  // Armar reporte de merges (solo donde hay más de 1 variante distinta)
  for (const [ck, variants] of variantsByCanonical.entries()) {
    const uniqueNames = Array.from(new Set(variants.map((v) => v.name)));
    if (uniqueNames.length <= 1) continue;

    const chosen = acc.get(ck)?.displayName ?? uniqueNames[0];
    report.merges.push({
      canonicalKey: ck,
      chosenDisplay: chosen,
      variants: variants,
      uniqueNames,
    });
  }

  // Construir JSON final ordenado por count desc
  const outObj = {};
  const sorted = Array.from(acc.values()).sort((a, b) => b.count - a.count);
  for (const item of sorted) outObj[item.displayName] = item.count;

  // Escribir outputs
  fs.writeFileSync(outputPath, JSON.stringify(outObj, null, 2), "utf-8");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");

  console.log("OK ✅");
  console.log(`- Fixed counts: ${outputPath}`);
  console.log(`- Report:       ${reportPath}`);
  console.log(`- Songs:        ${sorted.length}`);
  console.log(`- Medleys:      ${report.medleysExpanded.length}`);
  console.log(`- Merges:       ${report.merges.length}`);
}

main();
