import "./globals.css";
import type { Metadata } from "next";
import { Montserrat, Taviraj, Hind } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const taviraj = Taviraj({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-taviraj",
  display: "swap",
});

const hind = Hind({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Volantia",
    template: "%s | Volantia",
  },
  description: "App de alquiler temporal de autos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${taviraj.variable} ${hind.variable}`}
    >
      <body className={hind.className}>{children}</body>
    </html>
  );
}
