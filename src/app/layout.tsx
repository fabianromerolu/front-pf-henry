import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Montserrat, Taviraj, Hind } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer"
import { VehicleProvider } from "@/context/VehicleContext";

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
  title: "Volantia",
  description: "Volantia",
  icons: {
    icon: [
      { url: "/lightLogo.png" },
      { url: "/lightLogo.png", type: "image/svg+xml" },
      { url: "/lightLogo.png", sizes: "32x32", type: "image/png" },
      { url: "/lightLogo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/lightLogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMontserrat.variable} ${geistTaviraj.variable} ${geistHind.variable} antialiased`}
      >
        <AuthProvider>
        <Navbar />
        <VehicleProvider>
        {children}
        </VehicleProvider>
        <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
