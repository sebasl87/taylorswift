/**
 * Utilidades para manejo seguro de contenido bilingüe
 * Previene crashes por datos faltantes o inválidos
 */

/**
 * Obtiene traducción de forma segura con fallback
 * @param obj Objeto con traducciones {es?: string, en?: string}
 * @param locale Idioma solicitado ('es' | 'en')
 * @param fallback Valor por defecto si no hay traducción
 * @returns String con la traducción o fallback
 */
export function getSafeTranslation(
  obj: { es?: string; en?: string } | undefined | null,
  locale: "es" | "en",
  fallback: string = ""
): string {
  // Validar que obj existe y es un objeto
  if (!obj || typeof obj !== "object") {
    return fallback;
  }

  // Intentar obtener idioma solicitado
  const requested = obj[locale];
  if (requested && typeof requested === "string" && requested.trim().length > 0) {
    return requested.trim();
  }

  // Fallback al otro idioma
  const alternative = locale === "es" ? obj.en : obj.es;
  if (alternative && typeof alternative === "string" && alternative.trim().length > 0) {
    return alternative.trim();
  }

  // Si nada funciona, retornar fallback
  return fallback;
}

/**
 * Valida que una fecha sea válida
 * @param dateString Fecha en formato ISO
 * @returns Fecha válida o fecha actual
 */
export function getSafeDate(dateString: string | undefined | null): string {
  if (!dateString) {
    return new Date().toISOString();
  }

  const date = new Date(dateString);
  
  // Verificar que es una fecha válida
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date: ${dateString}, using current date`);
    return new Date().toISOString();
  }

  return date.toISOString();
}

/**
 * Formatea una fecha de forma segura
 * @param dateString Fecha en formato ISO
 * @param locale Idioma para formateo
 * @returns Fecha formateada o string de fallback
 */
export function formatSafeDate(
  dateString: string | undefined | null,
  locale: "es" | "en"
): string {
  try {
    const safeDate = getSafeDate(dateString);
    return new Date(safeDate).toLocaleDateString(
      locale === "es" ? "es-ES" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  } catch (error) {
    console.error("Error formatting date:", error);
    return locale === "es" ? "Fecha no disponible" : "Date unavailable";
  }
}

/**
 * Valida y sanitiza una URL
 * @param url URL a validar
 * @param fallback URL de fallback
 * @returns URL válida o fallback
 */
export function getSafeUrl(
  url: string | undefined | null,
  fallback: string = ""
): string {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  const trimmed = url.trim();
  
  // Si es una URL relativa válida
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Si es una URL absoluta, validar protocolo
  try {
    const urlObj = new URL(trimmed);
    if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
      return trimmed;
    }
  } catch {
    // URL inválida
  }

  return fallback;
}

/**
 * Valida que un objeto tenga las propiedades requeridas bilingües
 * @param obj Objeto a validar
 * @param field Nombre del campo para logging
 * @returns true si válido, false si no
 */
export function validateBilingualField(
  obj: { es?: string; en?: string } | undefined | null,
  field: string
): boolean {
  if (!obj || typeof obj !== "object") {
    console.warn(`Missing bilingual field: ${field}`);
    return false;
  }

  const hasEs = typeof obj.es === "string" && obj.es.trim().length > 0;
  const hasEn = typeof obj.en === "string" && obj.en.trim().length > 0;

  if (!hasEs || !hasEn) {
    console.warn(`Incomplete bilingual field ${field}: es=${hasEs}, en=${hasEn}`);
    return false;
  }

  return true;
}
