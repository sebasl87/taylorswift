# Placeholder para Noticias sin Imagen

## 🎨 Cómo Crear el Placeholder

Esta imagen se usa cuando una noticia no tiene imagen propia.

### Especificaciones Técnicas
- **Archivo:** `default-taylor-swift.jpg`
- **Ubicación:** `public/images/news/`
- **Tamaño:** 1200x630px (ratio 1.9:1)
- **Formato:** JPG o PNG
- **Peso:** < 200KB (optimizado)

---

## 🎯 Opciones de Creación

### Opción 1: Canva (Más Fácil)
1. Ve a [canva.com](https://canva.com)
2. Busca plantilla "Facebook Post" (1200x630)
3. Diseño sugerido:
   - Fondo: Gradiente azul/rosa/dorado (colores de eras)
   - Texto central: "Taylor Swift" + "News" o "Noticias"
   - Tipografía: Elegante y legible
   - Opcional: Iconos musicales sutiles
4. Descargar como JPG
5. Guardar en `public/images/news/default-taylor-swift.jpg`

### Opción 2: Figma/Photoshop (Más Control)
1. Crear canvas 1200x630px
2. Aplicar gradiente de fondo
3. Agregar texto y elementos
4. Exportar optimizado

### Opción 3: Usar Imagen Existente
- Busca una imagen genérica de concierto/música
- Redimensiona a 1200x630px
- Agrega overlay con texto

### Opción 4: IA (DALL-E, Midjourney)
Prompt sugerido:
```
"Abstract music background with golden sparkles and pink lights,
professional concert ambiance, elegant and clean design,
no text, suitable for news thumbnail, 1200x630 ratio"
```

---

## 💡 Consejos de Diseño

✅ **SÍ:**
- Colores de tu paleta (mira `src/constants/eras.ts`)
- Diseño limpio y profesional
- Buena legibilidad
- Relacionado con música/Taylor Swift

❌ **NO:**
- Imágenes con derechos de autor sin permiso
- Diseños muy cargados
- Texto ilegible
- Colores que choquen con el theme

---

## 🚀 Implementación Rápida

Si no tienes tiempo, usa esta solución temporal:

### Simple SVG como Placeholder

Crea `public/images/news/default-taylor-swift.svg`:

```svg
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)"/>
  <text x="50%" y="45%" text-anchor="middle" 
        font-family="Arial, sans-serif" font-size="80" 
        font-weight="bold" fill="white">
    TAYLOR SWIFT
  </text>
  <text x="50%" y="60%" text-anchor="middle" 
        font-family="Arial, sans-serif" font-size="50" 
        fill="rgba(255,255,255,0.8)">
    NOTICIAS • NEWS
  </text>
</svg>
```

Luego convierte SVG a JPG usando:
- https://cloudconvert.com/svg-to-jpg
- O cualquier convertidor online

---

## ✅ Verificación

Cuando termines, verifica:

1. ✅ Archivo en `public/images/news/default-taylor-swift.jpg`
2. ✅ Tamaño correcto (1200x630px)
3. ✅ Se ve bien en la web
4. ✅ Peso optimizado (< 200KB)

---

## 🔄 Actualización del Componente

El componente `NewsCard.tsx` ya está configurado para usar automáticamente:

1. Imagen del artículo (`article.imageUrl`)
2. Thumbnail de YouTube (si tiene `youtubeVideoId`)
3. **Placeholder por defecto** (si no tiene ninguna)

El fallback ya está implementado, solo necesitas crear la imagen.
