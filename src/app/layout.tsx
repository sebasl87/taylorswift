// Shell mínimo: el <html>/<body> reales viven en [locale]/layout.tsx, un
// nivel más adentro (patrón oficial de next-intl para App Router). Este
// archivo raíz solo existe porque Next.js requiere un layout.tsx en la raíz
// de app/ — además es el que renderiza la ruta global `_not-found` cuando
// una URL no matchea ningún segmento [locale] (ver src/app/not-found.tsx).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
