import VehicleCard from "@/components/Cards/VehicleCard";
import MenuBar from "@/components/MenuBar/MenuBar";
import mockProducts from "@/helpers/mockProducts";

export default function VehiclesPage() {
  return (
    <div>
      <MenuBar />
      <div>
        <div className="flex flex-wrap gap-6 justify-center mt-20">
          {mockProducts.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
}
