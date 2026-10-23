/**
 * Arma el bloque `alternates` de metadata (canonical + hreflang recíproco)
 * para una ruta dada, según el locale actual.
 *
 * Raíz = inglés (default, sin prefijo), /es/* = español. x-default → raíz.
 *
 * Caso especial: la raíz ("/") con prefijo /es debe dar "/es", no "/es/"
 * (doble slash) — con trailingSlash: false eso redirige 308, y el propio
 * canonical/hreflang terminaría apuntando a una URL que el sitio redirige.
 */
export function i18nAlternates(pathname: string, locale: string) {
  const esPath = pathname === "/" ? "/es" : `/es${pathname}`;
  const enPath = pathname;

  const languages = {
    en: enPath,
    es: esPath,
    "x-default": enPath,
  };

  return {
    canonical: locale === "es" ? esPath : enPath,
    languages,
  };
}
