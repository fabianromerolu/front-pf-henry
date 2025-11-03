import VehicleDetail from "@/components/VehicleDetail/VehicleDetail";
import type VehicleProps from "@/interfaces/vehicleProps";
import mockProducts from "@/helpers/mockProducts";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ idVehicle: string }>;
}) {
  // ✅ Esperar la promesa antes de usarla
  const { idVehicle } = await props.params;

  const vehicleId = Number(idVehicle);
  const vehicle = mockProducts.find((v: VehicleProps) => v.id === vehicleId);

  if (!vehicle) notFound();

  return <VehicleDetail vehicle={vehicle} />;
}
