import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { Montserrat, Taviraj, Hind } from "next/font/google";

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

export default function NotFound() {
  return (
    <div
      className={`${geistMontserrat.variable} ${geistTaviraj.variable} ${geistHind.variable} antialiased w-full flex flex-col items-center justify-center min-h-screen bg-gray-100`}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
        <h1 className="text-6xl font-bold text-[#141E61] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Ruta o producto no encontrado
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Lo sentimos, lo que buscas no existe o ha sido movido.
        </p>

        <Link
          href="/home"
          className="inline-block px-6 py-2 bg-[#141E61] text-white rounded hover:bg-indigo-600 transition"
        >
          Volver al inicio
        </Link>

        <Image
          src="https://miro.medium.com/v2/resize:fit:512/1*YWUpnY_zNbSfK62GSJIBbw.png"
          alt="Not Found Illustration"
          width={512}
          height={512}
          className="w-64 mt-8 h-auto"
        />
      </div>
    </div>
  );
}
