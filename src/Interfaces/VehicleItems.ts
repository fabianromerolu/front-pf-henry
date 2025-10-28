export enum BodyType {
  Sedan = "Sedan",
  Hatchback = "Hatchback",
  Suv = "Suv",
  Pickup = "Pickup",
  Van = "Van",
  Coupe = "Coupe",
  Convertible = "Convertible"
}

export enum Transmition {
  Manual = "Manual",
  Automatic = "Automatic"
}

export enum Category {
  Economy = "Economy",
  Compact = "Compact",
  Modsize = "Modsize",
  Suv = "Suv",
  Pickup = "Pickup",
  Van = "Van",
  Premium = "Premium",
  Electric = "Electric"
}

export enum Fuel {
  Gasoline = "Gasoline",
  Diesel = "Diesel",
  Hybrid = "Hybrid",
  Electric = "Electric"
}

export enum DriveTrain {
  FWD = "FWD",
  RWD = "RWD",
  AWD = "AWD",
  WD4 = "WD4"
}


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
