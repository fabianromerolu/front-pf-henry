import "./globals.css";
<<<<<<< HEAD
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { VehicleProvider } from "@/context/VehiclesContext";

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
=======
import type { Metadata } from "next";
>>>>>>> develop

export const metadata: Metadata = {
  title: {
    default: "Volantia",
    template: "%s | Volantia",
  },
  description: "App de alquiler temporal de autos",
  title: {
    default: "Volantia",
    template: "%s | Volantia",
  },
  description: "App de alquiler temporal de autos",
};

export default function RootLayout({
  children,
}: {
}: {
  children: React.ReactNode;
}) {
}) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body
        className={`${geistMontserrat.variable} ${geistTaviraj.variable} ${geistHind.variable} antialiased`}
      >
        <AuthProvider>
          <VehicleProvider>
            <Navbar />
            {children}
            <Footer />
          </VehicleProvider>
        </AuthProvider>
      </body>
=======
    <html lang="es">
      <body>{children}</body>
>>>>>>> develop
    </html>
  );
}
