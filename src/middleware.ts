import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Corre en todo excepto: rutas de API, internals de Next, internals de
  // Vercel, y cualquier archivo con extensión (assets estáticos).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
