// src/app/auth/sso/page.tsx

// Estas segment options DEBEN estar en un Server Component:
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";

import SsoBridgeClient from "./SsoBridgeClient";

export default function Page() {
  return <SsoBridgeClient />;
}
