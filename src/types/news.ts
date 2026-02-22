import { Database } from "./supabase";

// Tipo transformado de Supabase a formato legacy para compatibilidad
export type NewsArticleFromDB = Database["public"]["Views"]["news_articles_with_links"]["Row"];

export interface NewsArticle {
  id: string;
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  imageUrl?: string;
  imageAlt?: {
    en: string;
    es: string;
  };
  imageCaption?: {
    en: string;
    es: string;
  };
  publishedDate: string; // ISO format YYYY-MM-DD
  linkUrl?: string;
  linkTarget?: "_blank" | "_self";
  commentsActive?: boolean;
  youtubeVideoId?: string;
  externalLinks?: Array<{
    url: string;
    text: {
      en: string;
      es: string;
    };
  }>;
  // Nuevos campos de automatización
  isAutomated?: boolean;
  sourceUrl?: string;
}

// Helper para transformar de formato DB a formato UI
export function transformNewsFromDB(dbNews: NewsArticleFromDB): NewsArticle {
  // Validar campos críticos
  if (!dbNews || !dbNews.id) {
    throw new Error("Invalid news data: missing ID");
  }

  if (!dbNews.title_es && !dbNews.title_en) {
    console.error("Invalid news data: missing both titles", dbNews);
    throw new Error(`Invalid news data for ID ${dbNews.id}: missing titles`);
  }

  // Permitir descripciones vacías si hay un video de YouTube o imagen
  const hasMediaContent = dbNews.youtube_video_id || dbNews.image_url;
  if (!dbNews.description_es && !dbNews.description_en && !hasMediaContent) {
    console.error("Invalid news data: missing both descriptions and media content", dbNews);
    throw new Error(`Invalid news data for ID ${dbNews.id}: missing descriptions and media content`);
  }

  if (!dbNews.published_date) {
    console.error("Invalid news data: missing published_date", dbNews);
    throw new Error(`Invalid news data for ID ${dbNews.id}: missing published_date`);
  }

  const externalLinks = Array.isArray(dbNews.external_links)
    ? (dbNews.external_links as Array<{
        url: string;
        text_es: string;
        text_en: string;
      }>).map((link) => ({
        url: link.url,
        text: {
          es: link.text_es,
          en: link.text_en,
        },
      }))
    : [];

  return {
    id: dbNews.id,
    title: {
      es: dbNews.title_es || dbNews.title_en || "Sin título",
      en: dbNews.title_en || dbNews.title_es || "Untitled",
    },
    description: {
      es: dbNews.description_es || dbNews.description_en || "",
      en: dbNews.description_en || dbNews.description_es || "",
    },
    imageUrl: dbNews.image_url || undefined,
    imageAlt: dbNews.image_alt_es || dbNews.image_alt_en
      ? {
          es: dbNews.image_alt_es || "",
          en: dbNews.image_alt_en || "",
        }
      : undefined,
    imageCaption: dbNews.image_caption_es || dbNews.image_caption_en
      ? {
          es: dbNews.image_caption_es || "",
          en: dbNews.image_caption_en || "",
        }
      : undefined,
    publishedDate: dbNews.published_date,
    linkUrl: dbNews.link_url || undefined,
    linkTarget: dbNews.link_target || undefined,
    commentsActive: dbNews.comments_active || false,
    youtubeVideoId: dbNews.youtube_video_id || undefined,
    externalLinks: externalLinks.length > 0 ? externalLinks : undefined,
    isAutomated: dbNews.is_automated || false,
    sourceUrl: dbNews.source_url || undefined,
  };
}

// Helper para transformar de formato UI a formato DB (para insertar/actualizar)
export function transformNewsToDB(
  article: NewsArticle
): Database["public"]["Tables"]["news_articles"]["Insert"] {
  return {
    id: article.id,
    title_es: article.title.es,
    title_en: article.title.en,
    description_es: article.description.es,
    description_en: article.description.en,
    image_url: article.imageUrl || null,
    image_alt_es: article.imageAlt?.es || null,
    image_alt_en: article.imageAlt?.en || null,
    image_caption_es: article.imageCaption?.es || null,
    image_caption_en: article.imageCaption?.en || null,
    published_date: article.publishedDate,
    link_url: article.linkUrl || null,
    link_target: article.linkTarget || null,
    comments_active: article.commentsActive !== false,
    youtube_video_id: article.youtubeVideoId || null,
    is_automated: article.isAutomated || false,
    source_url: article.sourceUrl || null,
  };
}
