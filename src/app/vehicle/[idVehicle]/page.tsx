import VehicleDetail from "@/components/VehicleDetail/VehicleDetail";
import type VehicleItems from "@/Interfaces/VehicleItems";
import { BodyType, Category, DriveTrain, Fuel, Transmition } from "@/Interfaces/VehicleItems";


const mockVehicle: VehicleItems = {
  id: 1,
  title: "Kia Sportage",
  make: "Kia",
  model: "Sportage",
  year: 2023,
  trim: "LX",
  bodytype: BodyType.Suv,
  category: Category.Suv,
  transmition: Transmition.Automatic,
  fuel:Fuel.Electric,
  drivetrain: DriveTrain.WD4,
  color: "blue",
  seats: 5,
  doors: 5,
  state: "available",
  lat: 0,
  lng: 0,
  pricePerHour: 25,
  pricePerDay: 500,
  pricePerWeek: 2500,
  deposit: 1000,
  kmIncludedPerDay: 200,
  pricePerExtraKm: 5,
  minHours: 3,
  minDriverAge: 21,
  insuranceIncluded: true,
  rules: "No smoking.",
  description:
    "The Kia Sportage is a compact SUV that combines modern design, efficiency, and advanced technology. Its sleek, aerodynamic lines, signature ‘tiger nose’ grille, and stylish LED headlights give it a dynamic and sophisticated look on the road.",
  photo: "/cars/kia-sportage.jpg",
};

export default function Page() {
  return <VehicleDetail vehicle={mockVehicle} />;
}
