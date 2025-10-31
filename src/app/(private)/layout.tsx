import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import "../globals.css";

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
        <Navbar />
        <main className="pt-18">
        {children}
        </main>
        <Footer />
    </AuthProvider>
  );
}
