/**
 * URL absoluta de una ruta interna, con el prefijo de locale correcto.
 *
 * Misma convención que `i18nAlternates`: raíz = inglés (sin prefijo),
 * /es/* = español. Se usa en JSON-LD, donde schema.org exige URLs absolutas
 * y el valor debe coincidir con el canonical de la página.
 *
 * @example
 * absoluteUrl("/videos/shake-it-off", "es") // "https://taylorswift.com.ar/es/videos/shake-it-off"
 * absoluteUrl("/videos/shake-it-off", "en") // "https://taylorswift.com.ar/videos/shake-it-off"
 */
export function absoluteUrl(pathname: string, locale: string): string {
  const path =
    locale === "es" ? (pathname === "/" ? "/es" : `/es${pathname}`) : pathname;
  return `https://taylorswift.com.ar${path}`;
}
