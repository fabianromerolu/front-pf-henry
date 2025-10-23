export default interface VehicleItems {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  bodytype?: BodyType;
  category?: Category;
  transmition?: Transmition;
  fuel?: Fuel;
  drivetrain?: DriveTrain;
  color: string;
  seats: number;
  doors: number;
  state: string;
  lat: number;
  lng: number;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
  deposit: number;
  kmIncludedPerDay: number;
  pricePerExtraKm: number;
  minHours: number;
  minDriverAge: number;
  insuranceIncluded: boolean;
  rules: string;
  description: string;
  photo: string;
}

enum BodyType {
  Sedan,
  Hatchback,
  Suv,
  Pickup,
  Van,
  Coupe,
  Convertible,
}

enum Category {
  Economy,
  Compact,
  Modsize,
  Suv,
  Pickup,
  Van,
  Premium,
  Electric,
}

enum Transmition {
  Manual,
  Automatic,
}

enum Fuel {
  Gasoline,
  Diesel,
  Hybrid,
  Electric,
}

enum DriveTrain {
  FWD,
  RWD,
  AWD,
  WD4,
}
