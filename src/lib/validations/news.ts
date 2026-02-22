import { z } from "zod";

/**
 * Schema de validación para crear noticias manualmente
 * Basado en la estructura exacta de news_articles y news_external_links
 */
export const createNewsSchema = z.object({
  // Campos requeridos
  id: z.string().min(1, "ID es requerido"),
  title_es: z.string().min(1, "Título en español es requerido"),
  title_en: z.string().min(1, "Título en inglés es requerido"),
  description_es: z.string().min(1, "Descripción en español es requerida"),
  description_en: z.string().min(1, "Descripción en inglés es requerida"),
  published_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha debe ser YYYY-MM-DD"),

  // Campos opcionales de imagen
  image_url: z.string().refine(
    (val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
    "Debe ser una URL válida (http/https) o una ruta relativa (empezando con /)"
  ).optional(),
  image_alt_es: z.string().optional(),
  image_alt_en: z.string().optional(),
  image_caption_es: z.string().optional(),
  image_caption_en: z.string().optional(),

  // Campos opcionales de enlace
  link_url: z.string().refine(
    (val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
    "Debe ser una URL válida (http/https) o una ruta relativa (empezando con /)"
  ).optional(),
  link_target: z.enum(["_blank", "_self"]).optional(),

  // Campos opcionales de configuración
  comments_active: z.boolean().optional().default(true),
  youtube_video_id: z.string().optional(),
  
  // Campos de automatización
  is_automated: z.boolean().optional().default(false),
  source_url: z.string().refine(
    (val) => val.startsWith('http://') || val.startsWith('https://'),
    "Debe ser una URL válida (http/https)"
  ).optional(),

  // Enlaces externos (array opcional)
  external_links: z.array(
    z.object({
      url: z.string().url("URL del enlace externo debe ser válida"),
      text_es: z.string().min(1, "Texto en español del enlace es requerido"),
      text_en: z.string().min(1, "Texto en inglés del enlace es requerido"),
      order_index: z.number().int().min(0).optional().default(0),
    })
  ).optional(),
});

// Tipo inferido del schema
export type CreateNewsInput = z.infer<typeof createNewsSchema>;
