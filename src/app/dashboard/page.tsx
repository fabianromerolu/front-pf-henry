// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { meApi } from "@/services/userRenter.service";

export default function DashboardRoot() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const me = await meApi.getMe(); // { role: "ADMIN" | "RENTER" | "USER" }
        const role = me?.role ?? "USER";
        if (role === "ADMIN") router.replace("/dashboard/admin");
        else if (role === "RENTER") router.replace("/dashboard/renter");
        else router.replace("/dashboard/user");
      } catch {
        router.replace("/login");
      }
    })();
  }, [router]);

  return null; // pantalla en blanco muy breve
}
