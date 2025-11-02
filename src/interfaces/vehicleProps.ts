export enum BodyType {
  Sedan = "Sedan",
  Hatchback = "Hatchback",
  Suv = "Suv",
  Pickup = "Pickup",
  Van = "Van",
  Coupe = "Coupe",
  Convertible = "Convertible",
}

export enum Transmition {
  Manual = "Manual",
  Automatic = "Automatic",
}

export enum Category {
  Economy = "Economy",
  Premium = "Premium",
}

export enum Fuel {
  Gasoline = "Gasoline",
  Diesel = "Diesel",
  Hybrid = "Hybrid",
  Electric = "Electric",
}

export enum DriveTrain {
  FWD = "FWD",
  RWD = "RWD",
  AWD = "AWD",
  WD4 = "WD4",
}

export enum Status {
  borrador = "borrador",
  publicado = "publicado",
  pausado = "pausado",
  bloqueado = "bloqueado",
}

export default interface VehicleProps {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodytype?: BodyType;
  category?: Category;
  transmission?: Transmition;
  fuel?: Fuel;
  drivetrain?: DriveTrain;
  color?: string;
  seats: number;
  country?: string;
  city: string;
  state?: string;
  lat: number;
  lng: number;
  pricePerDay: number;
  deposit: number;
  kmIncludedPerDay: number;
  pricePerExtraKm: number;
  minHours: number;
  minDriverAge: number;
  insuranceIncluded: boolean;
  rules: string;
  description?: string;
  thumbnailUrl: string;
  status?: Status;
}
