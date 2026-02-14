# 🤖 Sistema Automático de Generación de Noticias

Este sistema genera automáticamente noticias de Taylor Swift dos veces por semana usando IA.

## 📋 Características

- ✅ **Busca noticias** de múltiples fuentes automáticamente
- ✅ **Reescribe con IA** (Google Gemini) en tono fan, español e inglés
- ✅ **Descarga imágenes** y las guarda localmente
- ✅ **Actualiza automáticamente** `news.json`
- ✅ **Ejecuta 2 veces por semana** (lunes y jueves)
- ✅ **100% gratuito** con las APIs free tier

---

## 🔧 Configuración Inicial

### 1. Obtener API Keys

#### **NewsAPI** (Buscar noticias)
1. Ve a https://newsapi.org/
2. Crea cuenta gratuita
3. Copia tu API Key
4. **Free tier:** 100 requests/día (suficiente)

#### **Google Gemini** (IA para transformar texto)
1. Ve a https://ai.google.dev/
2. Click en "Get API Key" → "Create API key in new project"
3. Copia tu API Key
4. **Free tier:** 60 req/min, 1500/día (muy generoso)

### 2. Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Click en "New repository secret"
4. Agrega estos secrets:

```
NEWSAPI_KEY: tu_api_key_de_newsapi
GEMINI_API_KEY: tu_api_key_de_gemini
```

**Opcional** - Para rebuild automático en Vercel:
```
VERCEL_DEPLOY_HOOK: https://api.vercel.com/v1/integrations/deploy/...
```

Para obtener el webhook de Vercel:
1. Ve a tu proyecto en Vercel.com
2. Settings → Git → Deploy Hooks
3. Crea un hook y copia la URL

---

## 🚀 Uso

### Ejecución Automática

El workflow se ejecuta automáticamente:
- **Lunes a las 10:00 UTC**
- **Jueves a las 10:00 UTC**

No necesitas hacer nada, GitHub Actions lo maneja todo.

### Ejecución Manual

Puedes ejecutarlo manualmente cuando quieras:

1. Ve a tu repositorio en GitHub
2. Actions → "Generate Taylor Swift News"
3. Click en "Run workflow"
4. Selecciona la branch (staging o main)
5. Click "Run workflow"

### Prueba Local (antes de subir a GitHub)

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env
echo "NEWSAPI_KEY=tu_key_aqui" > .env
echo "GEMINI_API_KEY=tu_key_aqui" >> .env

# 3. Ejecutar script
node scripts/generate-news.js
```

---

## 📁 Archivos Generados

### `src/constants/news.json`
Contiene array de noticias en formato:
```json
[
  {
    "id": "taylor-swift-nuevo-album-2026-123456",
    "title": {
      "es": "Título en español",
      "en": "Title in English"
    },
    "description": {
      "es": "Descripción en español...",
      "en": "Description in English..."
    },
    "imageUrl": "/images/news/taylor-swift-nuevo-album-2026-123456.jpg",
    "publishedDate": "2026-02-14",
    "linkUrl": "https://source.com/original-article",
    "linkTarget": "_blank"
  }
]
```

### `public/images/news/`
Imágenes descargadas de los artículos originales:
- `article-slug-123456.jpg`
- `another-article-789.jpg`
- etc.

---

## ⚙️ Configuración Avanzada

### Cambiar Frecuencia

Edita `.github/workflows/generate-news.yml`:

```yaml
schedule:
  - cron: '0 10 * * 1,4'  # Lunes y Jueves 10am UTC
```

Ejemplos:
- Diario: `'0 10 * * *'`
- Solo lunes: `'0 10 * * 1'`
- Tres veces por semana: `'0 10 * * 1,3,5'`

Usa [crontab.guru](https://crontab.guru/) para generar expresiones cron.

### Cambiar Cantidad de Noticias

En `scripts/generate-news.js`:

```javascript
const CONFIG = {
  newsapi: {
    pageSize: 5, // ← Cambiar aquí (1-100)
  },
  maxNews: 50, // ← Máximo de noticias a mantener histórico
};
```

### Personalizar Prompt de IA

En `scripts/generate-news.js`, función `transformWithAI()`:

```javascript
const prompt = `Eres un periodista musical experto...`; // ← Editar aquí
```

Puedes cambiar el tono, longitud, estilo, etc.

---

## 🐛 Troubleshooting

### "No se encontraron noticias nuevas"

**Problema:** NewsAPI no tiene noticias recientes de Taylor Swift.

**Solución:** 
- Es normal que algunos días no haya noticias
- El script se ejecutará nuevamente en el siguiente cron
- Puedes ajustar `query` en CONFIG para ser más amplio

### "Error 401 Unauthorized"

**Problema:** API key inválida o expirada.

**Solución:**
- Verifica que los secrets en GitHub estén correctos
- Regenera las API keys en los portales
- Actualiza los secrets en GitHub

### "Rate limit exceeded"

**Problema:** Excediste el límite gratuito de alguna API.

**Solución:**
- NewsAPI: Espera al día siguiente (100 req/día)
- Gemini: Muy difícil de exceder (1500 req/día)
- Reduce `pageSize` en CONFIG

### Las imágenes no se descargan

**Problema:** URLs de imágenes inválidas o protegidas.

**Solución:**
- El script usa fallback automático (placeholder)
- Crea `public/images/news/default-taylor-swift.jpg` como backup
- Algunas fuentes bloquean descarga de imágenes

### El workflow no se ejecuta

**Problema:** GitHub Actions deshabilitado o workflow inválido.

**Solución:**
- Ve a Actions en GitHub y verifica que esté habilitado
- Revisa la sintaxis del YAML
- Los cron schedules pueden tardar hasta 15 min en activarse

---

## 📊 Monitoreo

### Ver Ejecuciones

1. Ve a tu repo en GitHub
2. Tab "Actions"
3. Click en "Generate Taylor Swift News"
4. Ver historial de ejecuciones

### Ver Logs

1. Click en una ejecución específica
2. Click en el job "generate-news"
3. Ver logs detallados de cada paso

---

## 🔒 Seguridad

- ✅ **API keys nunca en el código** - Solo en GitHub Secrets
- ✅ **HTTPS para todas las requests**
- ✅ **No se guarda información sensible**
- ✅ **Commits automáticos firmados por github-actions[bot]**

---

## 💡 Tips

1. **Revisa ocasionalmente** las noticias generadas para calidad
2. **Ajusta el prompt** si el tono no te gusta
3. **Crea buen placeholder** para cuando no haya imagen
4. **Usa branch staging** para probar cambios antes de production
5. **Mantén las API keys seguras** - nunca las compartas

---

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs en GitHub Actions
2. Verifica que las API keys sean válidas
3. Ejecuta localmente para debugging
4. Revisa este README completamente

---

## 🎨 Siguiente Paso: Crear Placeholder

Crea `public/images/news/default-taylor-swift.jpg`:

**Especificaciones:**
- Tamaño: 1200x630px (ratio 1.9:1)
- Formato: JPG o PNG
- Contenido sugerido:
  - Fondo con gradiente del theme actual
  - Logo o texto "Taylor Swift News"
  - Diseño limpio y profesional
  - Colores acordes a tu paleta

**Alternativas:**
- Usar Canva (plantilla gratis)
- Generar con IA (DALL-E, Midjourney)
- Diseño simple con CSS/Canvas y screenshot

---

¡Listo! Tu sistema de noticias automáticas está configurado 🎉
