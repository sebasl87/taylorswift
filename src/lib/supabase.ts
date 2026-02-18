import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { transformNewsFromDB, NewsArticle } from "@/types/news";

// Variables de entorno para cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para uso público (frontend y server-side)
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

// Cliente admin solo disponible en servidor (lazy load)
let _supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;
  
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_KEY no está disponible. Solo usar en servidor.");
  }
  
  _supabaseAdmin = createClient<Database>(
    supabaseUrl,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
  
  return _supabaseAdmin;
}

// Funciones helper para obtener noticias (ya transformadas al formato UI)
export async function getAllNews(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from("news_articles_with_links")
    .select("*")
    .order("published_date", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }

  // Transformar de forma segura, filtrando items inválidos
  const transformed: NewsArticle[] = [];
  for (const item of data || []) {
    try {
      transformed.push(transformNewsFromDB(item));
    } catch (err) {
      console.error("Error transforming news item, skipping:", err);
      // Continuar con el siguiente item
    }
  }

  return transformed;
}

export async function getNewsByMonth(
  year: number,
  month: number
): Promise<NewsArticle[]> {
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("news_articles_with_links")
    .select("*")
    .gte("published_date", startDate)
    .lte("published_date", endDate)
    .order("published_date", { ascending: false });

  if (error) {
    console.error("Error fetching news by month:", error);
    return [];
  }

  // Transformar de forma segura, filtrando items inválidos
  const transformed: NewsArticle[] = [];
  for (const item of data || []) {
    try {
      transformed.push(transformNewsFromDB(item));
    } catch (err) {
      console.error("Error transforming news item, skipping:", err);
    }
  }

  return transformed;
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const { data, error } = await supabase
    .from("news_articles_with_links")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching news by id:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  try {
    return transformNewsFromDB(data);
  } catch (err) {
    console.error("Error transforming news item:", err);
    return null;
  }
}

export async function getLatestNews(limit: number = 10): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from("news_articles_with_links")
    .select("*")
    .order("published_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest news:", error);
    return [];
  }

  // Transformar de forma segura, filtrando items inválidos
  const transformed: NewsArticle[] = [];
  for (const item of data || []) {
    try {
      transformed.push(transformNewsFromDB(item));
    } catch (err) {
      console.error("Error transforming news item, skipping:", err);
    }
  }

  return transformed;
}
