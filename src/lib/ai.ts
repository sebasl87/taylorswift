import Groq from "groq-sdk";
import { z } from "zod";

/**
 * Cliente de Groq AI para procesamiento de noticias
 * Modelo: openai/gpt-oss-120b
 * Con retry logic y validación estricta
 */

// Schema de validación para respuesta de IA
// 400-600 palabras = ~2400-3600 caracteres
const AINewsResponseSchema = z.object({
  title_en: z.string().min(1).max(100),
  title_es: z.string().min(1).max(100),
  description_en: z.string().min(200).max(4000),
  description_es: z.string().min(200).max(4000),
  image_caption_en: z.string().min(1).max(80),
  image_caption_es: z.string().min(1).max(80),
});

// Lazy initialization: obtiene el cliente solo cuando se necesita
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY no está configurada en variables de entorno");
  }
  return new Groq({ apiKey });
}

/**
 * Retry con exponential backoff para llamadas a Groq
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(`⚠️  Groq retry ${attempt + 1}/${maxRetries} after ${delay}ms - Error: ${lastError.message}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

export interface ProcessedNewsContent {
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  image_caption_en: string;
  image_caption_es: string;
}

/**
 * Procesa noticias con Groq AI
 * Genera títulos bilingües, descripciones completas y captions
 */
export async function processNewsWithAI(
  title: string,
  content: string,
  sourceUrl: string
): Promise<ProcessedNewsContent> {
  const groq = getGroqClient();

  const prompt = `Eres un periodista profesional especializado en pop y musica de tendencia, escribiendo para un sitio web dedicado a Taylor Swift.

Tu tarea es transformar esta noticia en contenido profesional y bien estructurado.

ESTRUCTURA OBLIGATORIA (Pirámide invertida periodística):

1. LEAD (Primer párrafo - 50-80 palabras):
   - Responde: ¿QUÉ pasó? ¿QUIÉN? ¿CUÁNDO? ¿DÓNDE?
   - Lo más importante primero
   - Debe poder leerse solo y dar la noticia completa

2. DESARROLLO (Cuerpo - 200-350 palabras):
   - Detalles y contexto
   - Citas textuales del artículo original (si las hay)
   - Datos concretos: fechas, lugares, nombres completos
   - Información verificable

3. CONTEXTO (Cierre - 100-170 palabras):
   - Antecedentes relevantes
   - Impacto o consecuencias
   - Información adicional para fans

⚠️ FORMATO DE TEXTO CRÍTICO:
- Separa cada párrafo con DOBLE salto de línea: \\n\\n
- Mínimo 4-6 párrafos bien diferenciados
- NO escribas todo como un bloque continuo
- Ejemplo de formato correcto:
  "Primer párrafo con lead.\\n\\nSegundo párrafo con desarrollo.\\n\\nTercer párrafo continuando."

REGLAS ESTRICTAS:

✅ HACER:
- Tono periodístico profesional, objetivo
- Primera mención: nombres completos (Dave Mustaine, no "Dave")
- Incluir TODAS las citas textuales del artículo original
- Fechas completas (día, mes, año)
- Números y estadísticas exactas
- Nombres de álbumes, canciones, lugares específicos
- Traducción precisa y natural al español

❌ EVITAR:
- Tono conversacional o de fanático
- Opiniones personales o análisis subjetivo
- Lenguaje sensacionalista o clickbait
- Especulación sin fuente
- Repetir información
- Mencionar que alguien "dijo algo" sin incluir la cita exacta
- Usar "Dave" sin apellido en primera mención

TÍTULO:
- Máximo 80 caracteres
- Estilo periodístico directo
- Incluir nombre completo si es primera mención en título
- Versión en español: traducción natural, no literal

DESCRIPCIÓN:
- 400-600 palabras
- Ambos idiomas: mismo contenido, traducción profesional
- Si hay citas: mantenerlas en inglés original + traducción entre paréntesis en versión española

CAPTION DE IMAGEN:
- Máximo 60 caracteres
- Descriptivo y conciso

**IMPORTANTE: En las descripciones, usa \\n\\n para separar cada párrafo. NO devuelvas todo como texto continuo.**

---

NOTICIA ORIGINAL:

TÍTULO: ${title}

CONTENIDO: ${content}

FUENTE: ${sourceUrl}

---

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin \`\`\`json):

{
  "title_en": "título periodístico en inglés de máximo 80 caracteres",
  "title_es": "título traducido al español de máximo 80 caracteres",
  "description_en": "artículo completo en inglés de 400-600 palabras con párrafos separados por \\n\\n",
  "description_es": "artículo completo en español de 400-600 palabras con párrafos separados por \\n\\n",
  "image_caption_en": "caption descriptivo en inglés de máximo 60 caracteres",
  "image_caption_es": "caption descriptivo en español de máximo 60 caracteres"
}`;

  try {
    // Usar retry con backoff para llamada a Groq
    const parsed = await retryWithBackoff(async () => {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3, // Más determinista para periodismo
        max_tokens: 5000, // Dentro del límite free tier (6000/min)
        reasoning_effort: "low", // Obligatorio: sin esto el razonamiento agota max_tokens y corta el JSON
        response_format: { type: "json_object" }, // Forzar JSON válido
      });

      const text = completion.choices[0]?.message?.content;

      if (!text) {
        throw new Error("Groq no devolvió contenido");
      }

      // Parsear y validar con Zod
      const jsonData = JSON.parse(text);
      const validated = AINewsResponseSchema.parse(jsonData);
      return validated;
    }, 3, 1000); // 3 intentos, delay inicial 1 segundo

    return {
      title_en: parsed.title_en,
      title_es: parsed.title_es,
      description_en: parsed.description_en,
      description_es: parsed.description_es,
      image_caption_en: parsed.image_caption_en,
      image_caption_es: parsed.image_caption_es,
    };
  } catch (error) {
    console.error("❌ Error procesando con Groq AI después de varios reintentos:", error);

    // NO hay fallback: si Groq falla, descartamos la noticia
    // Esto garantiza que NUNCA se muestre contenido mal procesado al usuario
    throw new Error(`Groq AI falló al procesar la noticia: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Determina si una noticia es relevante para Taylor
 * Analiza el contenido para evitar falsos positivos
 */
export async function isRelevantToTaylor(
  title: string,
  content: string
): Promise<boolean> {
  const groq = getGroqClient();

  const prompt = `Eres un filtro de noticias especializado en Taylor Swift (la cantante de pop).

Analiza esta noticia y determina si es DIRECTAMENTE relevante para fans de Taylor Swift.

CRITERIOS PARA SER RELEVANTE (debe cumplir AL MENOS UNO):

✅ ES RELEVANTE si habla de:
- Taylor Swift directamente (álbumes, canciones, giras, apariciones públicas)
- Personas de su círculo cercano relevante para la noticia: pareja, familia, colaboradores musicales, productores habituales (ej. Jack Antonoff, Aaron Dessner)
- Proyectos, colaboraciones o negocios directamente relacionados con Taylor Swift (Eras Tour, regrabaciones "Taylor's Version", marcas asociadas, etc.)
- Menciones de otros artistas SI Y SOLO SI la noticia trata sobre su conexión/interacción con Taylor Swift

❌ NO ES RELEVANTE si:
- Solo menciona a Taylor Swift de pasada en una lista o ranking
- Es sobre otros artistas o bandas sin conexión directa con Taylor Swift
- Es sobre el género pop en general sin mencionar a Taylor Swift

---

TÍTULO: ${title}

CONTENIDO: ${content}

---

Responde ÚNICAMENTE con un objeto JSON:

{
  "is_relevant": true o false,
  "reason": "breve explicación de 1 línea"
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1, // Muy determinista para filtrado
      max_tokens: 1000, // Con reasoning_effort, 100 no alcanza para razonar + escribir el JSON
      reasoning_effort: "low", // Obligatorio: sin esto el razonamiento agota max_tokens y cae al catch (falso positivo)
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      return false;
    }

    const result = JSON.parse(text);
    return result.is_relevant === true;
  } catch (error) {
    console.error("❌ Error en filtro de relevancia:", error);

    const err = error as {
      status?: number;
      error?: { error?: { message?: string } };
      message?: string;
    };

    const status = err.status;
    const message = err.error?.error?.message ?? err.message ?? "";

    if (
      status === 401 ||
      (typeof message === "string" && message.includes("Invalid API Key"))
    ) {
      throw new Error(
        "Groq authentication failed: invalid or misconfigured GROQ_API_KEY",
      );
    }

    return true;
  }
}
