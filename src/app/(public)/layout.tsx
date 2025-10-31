import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Montserrat, Taviraj, Hind } from "next/font/google";
import "../globals.css";

const geistMontserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const geistTaviraj = Taviraj({
  variable: "--font-taviraj",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const geistHind = Hind({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Public pages",
  description: "Landing, login, register, not-found",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div
        className={`${geistMontserrat.variable} ${geistTaviraj.variable} ${geistHind.variable} antialiased`}
      >
        {children}
      </div>
    </AuthProvider>
  );
}
