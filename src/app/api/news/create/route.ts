import { NextRequest, NextResponse } from "next/server";
import { createNewsSchema } from "@/lib/validations/news";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/news/create
 * Crea una nueva noticia en la base de datos
 * Requiere autenticación con API Key en header X-API-Key
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar API Key
    const apiKey = request.headers.get("X-API-Key");
    const validApiKey = process.env.NEWS_API_KEY;

    if (!validApiKey) {
      console.error("NEWS_API_KEY no está configurada en variables de entorno");
      return NextResponse.json(
        { error: "Configuración del servidor incorrecta" },
        { status: 500 }
      );
    }

    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { error: "API Key inválida o no proporcionada" },
        { status: 401 }
      );
    }

    // 2. Parsear y validar el body
    const body = await request.json();
    const validatedData = createNewsSchema.parse(body);

    // 3. Obtener cliente admin de Supabase
    const supabase = getSupabaseAdmin();

    // 4. Verificar duplicados por ID o por source_url
    const { data: existingById } = await supabase
      .from("news_articles")
      .select("id")
      .eq("id", validatedData.id)
      .single();

    if (existingById) {
      return NextResponse.json(
        { error: `Ya existe una noticia con el ID: ${validatedData.id}` },
        { status: 409 }
      );
    }

    // Verificar duplicados por URL fuente (para noticias scrapeadas)
    if (validatedData.source_url) {
      const { data: existingByUrl } = await supabase
        .from("news_articles")
        .select("id, title_en")
        .eq("source_url", validatedData.source_url)
        .maybeSingle<{ id: string; title_en: string }>();

      if (existingByUrl) {
        return NextResponse.json(
          {
            error: "Noticia duplicada",
            message: `Ya existe una noticia con esta URL: "${existingByUrl.title_en}" (ID: ${existingByUrl.id})`,
          },
          { status: 409 }
        );
      }
    }

    // 5. Preparar datos del artículo (sin external_links)
    const { external_links, ...articleData } = validatedData;

    // 6. Insertar el artículo
    const { data: insertedArticle, error: articleError } = await supabase
      .from("news_articles")
      // @ts-expect-error - Supabase types don't match Zod validation
      .insert(articleData)
      .select()
      .single();

    if (articleError) {
      console.error("Error insertando artículo:", articleError);
      return NextResponse.json(
        { error: "Error al crear la noticia", details: articleError.message },
        { status: 500 }
      );
    }

    // 7. Insertar enlaces externos si existen
    let insertedLinks = null;
    if (external_links && external_links.length > 0) {
      const linksToInsert = external_links.map((link) => ({
        news_id: validatedData.id,
        url: link.url,
        text_es: link.text_es,
        text_en: link.text_en,
        order_index: link.order_index || 0,
      }));
      
      const { data: links, error: linksError } = await supabase
        .from("news_external_links")
        // @ts-expect-error - Supabase types don't match Zod validation
        .insert(linksToInsert)
        .select();

      if (linksError) {
        console.error("Error insertando enlaces externos:", linksError);
        // No retornamos error porque el artículo ya fue creado
        console.warn("Artículo creado pero con error en enlaces externos");
      } else {
        insertedLinks = links;
      }
    }

    // 8. Retornar respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: "Noticia creada exitosamente",
        data: {
          article: insertedArticle,
          external_links: insertedLinks,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Manejo de errores de validación de Zod
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as { issues: Array<{ path: Array<string | number>; message: string }> };
      return NextResponse.json(
        {
          error: "Datos de entrada inválidos",
          validation_errors: zodError.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Manejo de errores de JSON parsing
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "JSON inválido en el body de la request" },
        { status: 400 }
      );
    }

    // Otros errores
    console.error("Error inesperado:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
