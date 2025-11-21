// src/app/vehicles/layout.tsx
import { ReviewsProvider } from "@/context/ReviewContext";

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReviewsProvider>{children}</ReviewsProvider>;
}
