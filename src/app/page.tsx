import VehicleCard from "@/components/Cards/VehicleCard";

export default function Home() {
  const mockProducts = [
    {
      id: 1,
      title: "Kia Sportage 2022",
      make: "Kia",
      model: "Sportage",
      year: 2022,
      trim: "LX",
      color: "White",
      seats: 5,
      doors: 4,
      state: "Nuevo León",
      lat: 25.6866,
      lng: -100.3161,
      pricePerHour: 39,
      pricePerDay: 180,
      pricePerWeek: 1100,
      deposit: 200,
      kmIncludedPerDay: 200,
      pricePerExtraKm: 3,
      minHours: 3,
      minDriverAge: 21,
      insuranceIncluded: true,
      rules: "No smoking inside the vehicle. Return with a full tank.",
      description:
        "Comfortable and modern SUV ideal for family trips or long drives. Includes GPS, Bluetooth, and rear camera.",
      photo: "/assets/kiaCar.png",
    },
    {
      id: 2,
      title: "Tesla Model 3 2023",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      trim: "Long Range",
      color: "Midnight Silver",
      seats: 5,
      doors: 4,
      state: "Jalisco",
      lat: 20.6597,
      lng: -103.3496,
      pricePerHour: 60,
      pricePerDay: 300,
      pricePerWeek: 1800,
      deposit: 400,
      kmIncludedPerDay: 250,
      pricePerExtraKm: 4,
      minHours: 2,
      minDriverAge: 25,
      insuranceIncluded: true,
      rules: "Charging must be at 80% upon return. No pets allowed.",
      description:
        "Fully electric luxury sedan offering cutting-edge technology, autopilot, and a smooth driving experience.",
      photo: "/assets/kiaCar.png",
    },
    {
      id: 3,
      title: "Tesla Model 3 2023",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      trim: "Long Range",
      color: "Midnight Silver",
      seats: 5,
      doors: 4,
      state: "Jalisco",
      lat: 20.6597,
      lng: -103.3496,
      pricePerHour: 60,
      pricePerDay: 300,
      pricePerWeek: 1800,
      deposit: 400,
      kmIncludedPerDay: 250,
      pricePerExtraKm: 4,
      minHours: 2,
      minDriverAge: 25,
      insuranceIncluded: true,
      rules: "Charging must be at 80% upon return. No pets allowed.",
      description:
        "Fully electric luxury sedan offering cutting-edge technology, autopilot, and a smooth driving experience.",
      photo: "/assets/kiaCar.png",
    },
  ];

  return (
    <div>
      <div>
        <div className="flex flex-wrap gap-6 justify-center">
          {mockProducts.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
}
