// src/components/layout/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

const HIDDEN_ROUTES = ["/login", "/register", "/"];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    HIDDEN_ROUTES.includes(pathname) ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/");

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
