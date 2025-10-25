import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ⚠️ Abre la puerta a TODO host. Úsalo con cuidado en producción.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**"  },
    ],
    // Si prefieres no optimizar (y entonces no valida dominios), descomenta:
    // unoptimized: true,
  },
};

export default nextConfig;
