import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // La URL manda, no el header/cookie del visitante. Sin esto, next-intl
  // redirige automáticamente cualquier ruta a /es si el navegador manda
  // Accept-Language: es, incluso a un visitante que pidió explícitamente
  // la versión en inglés — rompe la premisa de tener rutas por idioma.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
