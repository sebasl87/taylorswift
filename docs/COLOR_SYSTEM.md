# Sistema de Colores por Era - Taylor Swift Fan Site

## Arquitectura de Diseño

Este sitio utiliza un sistema de temas dinámicos basado en las **eras musicales de Taylor Swift**. Cada era tiene una paleta de colores cuidadosamente seleccionada que refleja la estética visual y emocional del álbum correspondiente.

## Estructura del Sistema

Cada era define:

- **Colores primarios y secundarios**: Para componentes UI
- **Colores de fondo**: Para backgrounds y papers
- **Colores de texto**: Para contenido general
- **`heroText`**: Color específico para texto sobre gradientes (con alto contraste)
- **`heroOverlay`**: Capa semitransparente sobre gradientes para mejorar legibilidad
- **Gradient**: Gradiente característico de la era
- **Shadow**: Color de sombra para efectos visuales

## Decisiones de Color por Era

### 🌿 Taylor Swift (Debut) - 2006
**Paleta**: Verde Teal
- **Colores principales**: `#1D6F5D` (Dark Teal), `#B5EAD7` (Light Teal)
- **Razonamiento**: Tonos verdes y teal representan frescura, naturaleza y nuevos comienzos. Refleja la juventud country y la pureza del álbum debut.
- **Estética**: Primavera, campos abiertos, inicio de una carrera
- **Hero Text**: Blanco (`#FFFFFF`) para contraste máximo sobre gradiente oscuro
- **Overlay**: Verde oscuro semitransparente (`rgba(14, 59, 50, 0.4)`)

---

### 💛 Fearless - 2008
**Paleta**: Dorado/Champagne
- **Colores principales**: `#CFB53B` (Old Gold), `#EAD2AC` (Champagne)
- **Razonamiento**: Dorado y champagne evocan optimismo, romance de cuento de hadas y la "era dorada" del country-pop. Colores cálidos y brillantes.
- **Estética**: Cuentos de hadas, vestidos dorados, optimismo juvenil
- **Hero Text**: Marrón muy oscuro (`#3E2A00`) para contraste sobre dorado
- **Overlay**: Marrón dorado semitransparente (`rgba(74, 50, 0, 0.3)`)

---

### 💜 Speak Now - 2010
**Paleta**: Púrpura/Lavanda
- **Colores principales**: `#743089` (Purple), `#D2B4DE` (Lilac)
- **Razonamiento**: Púrpura y lavanda representan realeza, magia y fantasía. Colores asociados con vestidos de cuento y momentos encantados.
- **Estética**: Princesas, magia, vestidos de gala, fantasía romántica
- **Hero Text**: Púrpura muy oscuro (`#2B0F35`) para contraste
- **Overlay**: Púrpura oscuro semitransparente (`rgba(55, 21, 68, 0.35)`)

---

### ❤️ Red - 2012
**Paleta**: Rojo Profundo
- **Colores principales**: `#9E2A2B` (Deep Red), `#E09F9F` (Light Red)
- **Razonamiento**: Rojo profundo simboliza emociones intensas, pasión, amor ardiente y heartbreak. El color más emblemático del álbum.
- **Estética**: Pasión, otoño, labios rojos, hojas cayendo
- **Hero Text**: Blanco (`#FFFFFF`) para máximo contraste sobre rojos oscuros
- **Overlay**: Rojo muy oscuro semitransparente (`rgba(84, 11, 14, 0.4)`)

---

### 🏙️ 1989 - 2014
**Paleta**: Azul Cielo
- **Colores principales**: `#6CA0DC` (Little Boy Blue), `#B6D0E2` (Powder Blue)
- **Razonamiento**: Azules cielo representan Nueva York, pop urbano, libertad y cielos despejados. Inspirado en los 80s y la ciudad.
- **Estética**: Nueva York, rascacielos, polaroids, pop sintetizado
- **Hero Text**: Azul casi negro (`#0D1418`) para contraste
- **Overlay**: Azul gris oscuro semitransparente (`rgba(26, 37, 48, 0.35)`)

---

### 🐍 Reputation - 2017
**Paleta**: Negro/Gris Oscuro
- **Colores principales**: `#1A1A1A` (Almost Black), `#4A4A4A` (Dark Grey)
- **Razonamiento**: Negro y gris oscuro simbolizan misterio, oscuridad, renacimiento y la "serpiente". Era más oscura y dramática.
- **Estética**: Gótico, serpientes, periódicos, oscuridad elegante
- **Hero Text**: Blanco puro (`#FFFFFF`) para máximo contraste
- **Overlay**: Negro semitransparente fuerte (`rgba(0, 0, 0, 0.5)`)

---

### 💗 Lover - 2019
**Paleta**: Rosa/Azul Pastel
- **Colores principales**: `#F8C8DC` (Pastel Pink), `#A7C7E7` (Pastel Blue)
- **Razonamiento**: Rosa y azul pastel evocan romance, dulzura, colores de algodón de azúcar. Paleta brillante, optimista y soñadora.
- **Estética**: Arcoíris, algodón de azúcar, unicornios, romance Disney
- **Hero Text**: Rosa muy oscuro (`#8B0F3D`) para contraste fuerte
- **Overlay**: Rosa oscuro semitransparente suave (`rgba(194, 24, 91, 0.25)`)

---

### 🌲 Folklore - 2020
**Paleta**: Gris/Beige
- **Colores principales**: `#708090` (Slate Grey), `#CFCFC4` (Pastel Grey)
- **Razonamiento**: Grises y beige representan naturaleza, cottagecore, bosques neblinosos. Paleta apagada, introspectiva y orgánica.
- **Estética**: Bosques, cardigans, cabañas, indie folk
- **Hero Text**: Gris muy oscuro (`#1A2528`) para contraste
- **Overlay**: Gris pizarra oscuro semitransparente (`rgba(47, 79, 79, 0.3)`)

---

### 🍂 Evermore - 2020
**Paleta**: Marrón/Tan
- **Colores principales**: `#8B4513` (Saddle Brown), `#C7B19C` (Tan)
- **Razonamiento**: Marrones y tan evocan otoño, naturaleza, historia y cuentos antiguos. Hermano de folklore con tonos más cálidos.
- **Estética**: Otoño, flannel, cuentos antiguos, bosques en noviembre
- **Hero Text**: Marrón muy oscuro (`#2B1810`) para contraste
- **Overlay**: Marrón oscuro semitransparente (`rgba(62, 39, 35, 0.35)`)

---

### 🌙 Midnights - 2022
**Paleta**: Púrpura Oscuro/Azul Medianoche
- **Colores principales**: `#2D1B4E` (Deep Purple), `#5B4A7E` (Muted Purple)
- **Razonamiento**: Púrpura oscuro y azul medianoche representan la noche, introspección, pensamientos de las 2 AM. Paleta nocturna y misteriosa.
- **Estética**: Medianoche, cielos estrellados, pensamientos nocturnos, disco morado
- **Hero Text**: Blanco puro (`#FFFFFF`) para máximo contraste en oscuro
- **Overlay**: Negro púrpura semitransparente fuerte (`rgba(10, 6, 21, 0.5)`)

---

## Mejoras de Accesibilidad

### Problema Original
Los gradientes que iban de claro a oscuro causaban problemas de legibilidad del texto en ciertas áreas del hero.

### Solución Implementada

1. **Overlay Semitransparente**: Se agregó una capa `::before` con `heroOverlay` que oscurece uniformemente el gradiente
2. **Hero Text Color**: Color de texto específico para cada era con alto contraste sobre su respectivo gradiente
3. **Text Shadow**: Sombras de texto que usan el `shadowColor` de cada era para dar profundidad y legibilidad
4. **Cards con Backdrop Filter**: Las cards tienen `backdrop-filter: blur(10px)` y fondo semi-opaco para verse bien sobre cualquier gradiente

### Ratios de Contraste
Todos los colores de `heroText` han sido elegidos para mantener un ratio de contraste WCAG AA (mínimo 4.5:1) o superior contra los gradientes de su era.

## Uso en Componentes

```tsx
import { useEra } from "@/context/EraContext";

function MyComponent() {
  const { currentEra } = useEra();
  
  return (
    <Box
      sx={{
        background: currentEra.gradient,
        color: currentEra.colors.heroText,
        textShadow: `2px 2px 8px ${currentEra.shadowColor}`,
      }}
    >
      Contenido con buen contraste
    </Box>
  );
}
```

## Referencias

- [The Eras Tour - Wikipedia](https://en.wikipedia.org/wiki/The_Eras_Tour)
- [Taylor Swift Albums](https://en.wikipedia.org/wiki/Taylor_Swift_albums_discography)
- Observaciones de conciertos, videos musicales y estética oficial de cada álbum
