# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Sitio fan-made de Taylor Swift. Next.js 15 App Router con TypeScript, MUI v7, internacionalización EN/ES, y datos dinámicos vía Supabase + Groq AI.

## Comandos

El proyecto usa **Yarn 3** como package manager (`packageManager: "yarn@3.6.4"` en package.json).

```bash
yarn dev             # Servidor de desarrollo (localhost:3000)
yarn build           # Build de producción + SSG
yarn lint            # ESLint check
yarn start           # Servidor de producción
yarn vitest          # Ejecutar tests
yarn vitest run <archivo>  # Ejecutar un test específico

# Scripts de sincronización de datos
yarn sync:backfill   # Setlist.fm sync completo
yarn sync:update     # Setlist.fm sync incremental
yarn sync:fix        # Corregir conteos de canciones
```

## Stack

- **Next.js 15** App Router (no Pages Router)
- **React 19** con componentes funcionales
- **MUI v7** + Emotion (SSR-safe CSS-in-JS)
- **next-intl v4** para i18n (locales: `en`, `es`)
- **Supabase** — Base de datos (noticias, comentarios)
- **Vercel KV** — Cache distribuido (Redis) para queries costosas
- **Groq API** — Llama 3.3 70B para procesar noticias con IA
- **Vitest** con happy-dom para testing

## Arquitectura

### Internacionalización (i18n)

Todas las páginas viven bajo `/src/app/[locale]/`. El locale se detecta automáticamente por URL. Las traducciones están en `/messages/`:

- `en.json` / `es.json` — traducciones principales
- `contact.{en,es}.json`, `faq.{en,es}.json`, `privacy.{en,es}.json`, `terms.{en,es}.json` — secciones separadas

Hooks a usar: `useTranslations()` (client), `getMessages()` / `getLocale()` (server). Timezone fijo: `America/Argentina/Buenos_Aires`.

### Sistema de Eras (Tema Dinámico)

`EraContext` ([src/context/EraContext.tsx](src/context/EraContext.tsx)) gestiona la era activa, persistida en localStorage con clave `taylor-era`. El tema MUI se regenera dinámicamente según la era via `getDesignTokens(era)` en [src/theme/createTheme.ts](src/theme/createTheme.ts).

Hay 10 eras definidas en [src/constants/eras.ts](src/constants/eras.ts), cada una con paleta de colores y modo claro/oscuro. Las eras `reputation` y `midnights` usan dark mode automáticamente.

### Datos Estáticos

`/src/constants/` es la fuente de verdad para datos que cambian poco:

- `discography.json` (495KB) — Álbumes completos con tracklist y streaming links
- `shows.json` — Histórico de shows
- `eras.ts` — Definición de las 10 eras
- `interviews.json`, `videos.json`, `historia.json`, `bootlegs.json`, `tourDates.ts`

### Base de Datos (Supabase)

Funciones helper en [src/lib/supabase.ts](src/lib/supabase.ts): `getAllNews()`, `getNewsByMonth()`, `getNewsById()`, `getLatestNews()`. Usar el cliente admin (`supabaseAdmin`) solo en server-side (API routes).

### Procesamiento IA (Groq)

[src/lib/ai.ts](src/lib/ai.ts) — `processNewsWithAI()` recibe un artículo crudo y devuelve títulos y descripciones bilingües (EN/ES). Incluye retry con exponential backoff (3 intentos, 1s inicial). `isRelevantToTaylor()` filtra noticias irrelevantes antes de procesarlas.

### Rutas API

En `/src/app/api/`:
- `/api/show/[id]` — Detalles de show (consume setlist.fm)
- `/api/last-show` — Último concierto con caché en Vercel KV
- `/api/news/create` — Crea noticia: procesa con IA → valida relevancia → guarda en Supabase
- `/api/comments` — Sistema de comentarios
- `/api/tour` — Fechas de gira

## Convenciones

- **`"use client"`** solo cuando el componente necesita hooks de estado/efectos o event handlers. Por defecto, los componentes son Server Components.
- **Path alias:** `@/` apunta a `./src/`
- **Responsive:** MUI Grid v2 — usar `size={{ xs: 12, md: 6 }}` (no `xs={12}`)
- **Imágenes:** Optimización AVIF/WebP vía next/image. Hosts remotos configurados en `next.config.ts`.
- **Slugs:** Usar `slugify()` de [src/utils/slugify.ts](src/utils/slugify.ts) para generar URLs.
- **Sanitización HTML:** Usar `safeContent()` de [src/utils/safeContent.ts](src/utils/safeContent.ts) antes de renderizar HTML externo.
- **Validación:** Zod para datos de APIs externas y formularios.

## Variables de Entorno

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY          # Solo servidor
GROQ_API_KEY
SETLISTFM_API_KEY
KV_REST_API_URL
KV_REST_API_TOKEN
NEWS_API_URL
NEWS_API_KEY
```

### Pipeline de Noticias Automatizado

`scripts/scrape-news.js` es ejecutado diariamente a las 10:00 UTC por GitHub Actions (`.github/workflows/generate-news.yml`). El flujo es:

1. Lee 2 feeds RSS por día (rotación semanal entre People, Google News, Reddit, Billboard, Variety, Rolling Stone, etc.)
2. Filtra artículos con `isRelevantToTaylor()` (Groq, temperatura 0.1)
3. Procesa con `processNewsWithAI()` (Groq Llama 3.3 70B, genera contenido bilingüe EN/ES)
4. Publica via `POST /api/news/create` con `X-API-Key` header

La rotación de 2 feeds/día respeta el límite de ~100K tokens/día de Groq.

## Estado actual

**Rama:** `staging` (rama principal para PRs: `main`)

<!-- Actualizar esta sección al finalizar cada sesión -->
