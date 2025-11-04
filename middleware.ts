import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = new Set<string>([
  "/", "/home",
  "/login", "/register",
  "/forgot-password",
  "/auth/sso",
]);

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
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

  const raw = req.cookies.get("auth_token")?.value ?? "";
  const hasJwtShape = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(raw);
  const hasFrontSession = hasJwtShape; // role solo no alcanza

  if (pathname.startsWith("/dashboard")) {
    if (!hasFrontSession) {
      const url = new URL("/login", req.url);
      url.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(url);
    }

    // Redirección opcional por rol
    if ((pathname === "/dashboard" || pathname === "/dashboard/") && hasJwtShape) {
      const role = req.cookies.get("role")?.value;
      if (role === "admin" || role === "renter" || role === "user") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }
    }
  }
  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|assets).*)"],
};
