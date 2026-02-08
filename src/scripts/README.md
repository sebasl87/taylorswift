# Scripts de Sincronización de Setlist.fm

Scripts para descargar y contabilizar canciones de shows de Taylor Swift desde setlist.fm.

## Configuración

La API key está configurada en `.env`:
```
SETLISTFM_API_KEY=tu_api_key
```

El MBID de Taylor Swift es: `20244d07-534f-4eff-b4d4-930878889970`

## Scripts Disponibles

### 1. Sincronización de Shows (`setlist-sync.mjs`)

Descarga shows desde setlist.fm y genera estadísticas de canciones.

**Modo Backfill** (descarga todo el historial):
```bash
npm run sync:backfill
```

**Modo Update** (solo shows nuevos):
```bash
npm run sync:update
```

**Archivos generados:**
- `src/data/shows.raw.json` - Todos los shows descargados
- `src/data/songs.counts.json` - Conteo bruto de canciones
- `src/data/songs.meta.json` - Metadata de la sincronización

### 2. Normalización de Nombres (`fix-song-counts.mjs`)

Corrige variaciones en nombres de canciones y genera el conteo final.

```bash
npm run sync:fix
```

**Qué hace:**
- Normaliza apóstrofes, comillas y espacios
- Separa medleys (canciones con " / ")
- Merge variantes del mismo tema
- Elige el "mejor" nombre display entre variantes

**Archivos generados:**
- `src/constants/songs.counts.fixed.json` - Conteo final normalizado
- `src/data/songs.counts.report.json` - Reporte de cambios

## Flujo Completo

### Primera vez (backfill completo):
```bash
npm run sync:backfill
npm run sync:fix
```

### Actualizaciones periódicas:
```bash
npm run sync:update
npm run sync:fix
```

## Rate Limiting

El script maneja automáticamente el rate limiting de la API:
- Backoff exponencial en caso de 429
- Pausas entre requests (350ms)
- Hasta 8 reintentos con jitter

## Notas

- El backfill puede tardar varios minutos dependiendo del historial
- Los archivos se van actualizando progresivamente
- El modo update se detiene al encontrar shows ya conocidos
- Máximo 10 páginas en modo update (safety)
