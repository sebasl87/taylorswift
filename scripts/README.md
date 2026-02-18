# 🤖 Scripts de Automatización

## generate-news.js

Script para generar noticias automáticas de Taylor Swift usando IA.

### 🚀 Ejecución Rápida

```bash
# 1. Configurar variables de entorno
export NEWSAPI_KEY="tu_key_aqui"
export GEMINI_API_KEY="tu_key_aqui"

# 2. Ejecutar
node scripts/generate-news.js
```

### ⚙️ Qué hace

1. ✅ Busca noticias recientes en NewsAPI
2. ✅ Transforma con IA (Gemini) a tono fan
3. ✅ Descarga imágenes localmente
4. ✅ Actualiza `src/constants/news.json`
5. ✅ Traduce a español e inglés

### 📋 Requisitos

- Node.js 18+
- API Keys configuradas (ver docs/AUTO_NEWS_SETUP.md)
- Conexión a internet

### 📊 Output Esperado

```bash
🚀 Iniciando generación de noticias...

📄 News.json actual tiene 0 artículos

🔍 Buscando noticias en NewsAPI...
✅ Encontradas 5 noticias

🤖 Transformando con IA: "Taylor Swift announces new album..."
✅ Transformación completada
✅ Image downloaded: article-123.jpg
✅ Artículo procesado: Taylor Swift anuncia nuevo álbum

✅ Procesados 3 nuevos artículos
✅ news.json actualizado con 3 artículos totales

🎉 ¡Proceso completado exitosamente!
```

### 🐛 Debug

Si algo falla, verifica:
- API keys válidas
- Conexión a internet
- Permisos de escritura en carpetas
- Límites de API no excedidos

### 📚 Documentación Completa

Ver: `docs/AUTO_NEWS_SETUP.md`
