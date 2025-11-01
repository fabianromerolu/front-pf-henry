import type VehicleProps from "@/interfaces/vehicleProps";
import mockProducts from "@/helpers/mockProducts";
import { notFound } from "next/navigation";
import VehicleDetail from "@/components/vehicledetail/VehicleDetail";

export const metadata = {
  title: "Vehicle Detail",
};

export default async function Page(props: {
  params: Promise<{ idVehicle: string }>;
}) {
  const { idVehicle } = await props.params;

  const vehicleId = Number(idVehicle);
  const vehicle = mockProducts.find((v: VehicleProps) => v.id === vehicleId);

  if (!vehicle) notFound();

  return <VehicleDetail vehicle={vehicle} />;
}
