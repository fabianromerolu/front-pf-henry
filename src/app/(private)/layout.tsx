import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import "../globals.css";
import { VehicleProvider } from "@/context/VehicleContext";

export const metadata = {
  title: "App Private Layout",
  description: "Layout for authenticated sections",
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <VehicleProvider>
        <Navbar />
        <main className="pt-18">{children}</main>
        <Footer />
      </VehicleProvider>
    </AuthProvider>
  );
}
