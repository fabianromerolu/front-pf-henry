// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = new Set<string>([
  "/", "/home",
  "/login", "/register",
  "/forgot-password",
]);

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // Deja pasar assets/estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    /\.(?:png|jpg|jpeg|gif|svg|ico|webp|txt|xml|json)$/.test(pathname)
  ) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // Protege dashboard (ajusta si quieres incluir más)
  if (pathname.startsWith("/dashboard")) {
    const token =
      req.cookies.get("volantia_token")?.value ||
      req.cookies.get("auth_token")?.value;
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Evita que el middleware corra sobre estáticos por matcher
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|assets).*)"],
};
