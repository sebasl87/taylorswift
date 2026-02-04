// Estructura para descripciones multiidioma
export interface BootlegDescription {
  es: string;
  en: string;
}

// Estructura principal para un bootleg
export interface Bootleg {
  id: string;
  title: string; // Título del bootleg
  date: string; // Formato ISO 8601 (YYYY-MM-DD)
  city: string;
  venue: string;
  country: string;
  era: string;
  description: BootlegDescription;
  setlist: string[];
  youtube: string; // URL del video/playlist en YouTube
  image?: string; // Imagen del bootleg (opcional)
  linkEra: string;
}

// Helper para formatear la fecha del bootleg según el locale
export function formatBootlegDate(dateString: string, locale: string): string {
  // Parsear la fecha manualmente para evitar problemas con zonas horarias
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const formatted = date.toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Capitalizar la primera letra
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
}

// Helper para obtener el ID de video de YouTube
export function getYouTubeVideoId(url: string): string | null {
  // Si es un enlace de búsqueda, retornar null
  if (url.includes("youtube.com/results")) {
    return null;
  }
  
  // Intentar extraer el ID del video
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  
  return match ? match[1] : null;
}

// Helper para generar el slug del bootleg
export function generateBootlegSlug(bootleg: Bootleg): string {
  return bootleg.id;
}

// Helper para obtener la descripción según el idioma
export function getBootlegDescription(
  bootleg: Bootleg,
  locale: string
): string {
  return locale === "es" ? bootleg.description.es : bootleg.description.en;
}

// Helper para obtener el año de un bootleg
export function getBootlegYear(bootleg: Bootleg): number {
  return new Date(bootleg.date).getFullYear();
}
