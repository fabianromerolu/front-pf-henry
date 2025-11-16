// src/app/auth/sso/page.tsx

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";

import SsoBridgeClient from "./SsoBridgeClient";

export default function Page() {
  return <SsoBridgeClient />;
}
