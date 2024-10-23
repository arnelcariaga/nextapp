import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Helper function to check if the user has access to the screen or subroutes
function hasAccess(path: string, screens: any[]) {
  // Verifica si alguna ruta en el array de screens es una coincidencia inicial
  return screens.some((screen) => path.startsWith(screen.path));
}

export default auth((req) => {
  const { nextUrl, auth } = req;
  const pathname = nextUrl.pathname;
  const origin = nextUrl.origin;

  // Permitir acceso a la página de error o la raíz
  if (pathname === "/not-found") {
    return NextResponse.next();
  }

  // Si no está autenticado y va a rutas protegidas, redirigir al login
  if (
    !auth &&
    [
      "/dashboard",
      "/roles",
      "/users",
      "/sais",
      "/community_operations",
    ].includes(pathname)
  ) {
    const newUrl = new URL("/", origin); // Redirigir a la página de login
    return NextResponse.redirect(newUrl);
  }

  // Si el usuario autenticado intenta acceder a la raíz, redirigir al dashboard
  if (auth && pathname === "/") {
    const newUrl = new URL("/dashboard", origin);
    return NextResponse.redirect(newUrl);
  }

  // Si el usuario está autenticado, validar sus permisos
  if (auth) {
    const userScreens = auth?.user?.screens || [];

    if (!hasAccess(pathname, userScreens)) {
      return NextResponse.redirect(new URL("/not-found", req.url));
    }

    // Si ninguna condición anterior se cumple, continuar la solicitud
    return NextResponse.next();
  }
});

// Set routes to apply the middleware
export const config = {
  matcher: [
    "/dashboard",
    "/community_operations/:path*",
    "/roles",
    "/users",
    "/sais",
    "/any_other_route",
  ], // Use :path* to include subroutes
};
