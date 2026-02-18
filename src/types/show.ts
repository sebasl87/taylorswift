// Estructura para descripciones multiidioma
export interface ShowDescription {
  es: string;
  en: string;
}

// Estructura principal para un show histórico
export interface Show {
  id: string;
  date: string; // Formato ISO 8601 (YYYY-MM-DD)
  city: string;
  venue: string;
  country: string;
  era: string;
  whyHistoric: ShowDescription;
  setlist: string[];
  setlistUrl: string;
  youtube: string;
  image: string;
  linkEra: string;
}

// Helper para formatear la fecha del show según el locale
export function formatShowDate(dateString: string, locale: string): string {
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
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
}

// Helper para crear el slug del show (usado en la URL)
export function generateShowSlug(show: Show): string {
  return show.id;
}

// Helper para obtener la descripción histórica según el locale
export function getShowHistoricDescription(
  show: Show,
  locale: string
): string {
  return show.whyHistoric[locale as "es" | "en"] || show.whyHistoric.es;
}
