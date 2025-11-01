"use client";
import Image from "next/image";
import Link from "next/link";
import VehicleProps from "@/interfaces/vehicleProps";
import DarkButton from "../Buttoms/DarkButtom";
import LightButton from "../Buttoms/LightButtom";

interface VehicleDetailProps {
  vehicle: VehicleProps;
}

const SteeringWheelIcon = "/icons/steeringWheel.svg";
const ElectricCarIcon = "/icons/electricCar.svg";
const PetrolPumpIcon = "/icons/petrolPump.svg";
const SeatsIcon = "/icons/seats.svg";

export default function VehicleDetail({ vehicle }: VehicleDetailProps) {
  return (
<<<<<<< HEAD
    <main className="grid md:grid-cols-3 text-custume-light  max-w-9xl mx-auto shadow-xl min-h-[50rem]">
      <section className="md:col-span-1 bg-dark-blue font-montserrat text-custume-light grid grid-rows-[30%_70%] h-full">
        <div className="flex flex-col  text-custume-light sm:p-2">
          <header className="flex justify-between items-start mb-6 p-6">
            <h1 className="font-normal tracking-tight">
              <span className="text-4xl font-light block">{vehicle.title}</span>

              <span className="text-xl font-normal block">{vehicle.title}</span>
            </h1>
          </header>

          <ul className="grid md:grid-cols-4 flex justify-center space-x-12 text-center mt-2 text-custume-light/70">
            <li>
              <div className="flex flex-col items-center md:col-span-1 text-base mb-1">
                <Image
                  src={SteeringWheelIcon}
                  width={35}
                  height={35}
=======
    <main className="grid md:grid-cols-3 text-custume-light  max-w-7xl mx-auto shadow-xl min-h-[50rem]">
      <section className="md:col-span-2 bg-dark-blue font-montserrat text-custume-light grid grid-rows-[50%_50%] h-full">
        <div className="flex flex-col  text-custume-light p-6 sm:p-8">
          <header className="flex justify-between items-start mb-6 p-6">
            <h1 className="font-normal tracking-tight">
              <span className="text-4xl font-light block">{vehicle.make}</span>

              <span className="text-4xl font-normal block">
                {vehicle.model}
              </span>
            </h1>

            <p className="text-4xl font-light text-custume-light">
              ${vehicle.pricePerDay}
            </p>
          </header>

          <ul className="flex justify-start space-x-12 p-6 text-center mt-auto text-custume-light/70">
            <li>
              <div className="text-xl mb-1">
                <Image
                  src={SteeringWheelIcon}
                  width={60}
                  height={60}
>>>>>>> develop
                  alt="steering-Wheel"
                />
              </div>
              {vehicle.bodytype || "SUV"}
            </li>

<<<<<<< HEAD
            <li className="flex flex-col items-center md:col-span-1 ">
              <Image src={SeatsIcon} width={35} height={35} alt="seats" />
              <span className="text-base mt-1">{vehicle.seats} sits </span>
            </li>

=======
>>>>>>> develop
            <li>
              <div className="flex flex-col items-center md:col-span-1 text-base mb-1">
                <Image src={PetrolPumpIcon} width={35} height={35} alt="pump" />
              </div>
<<<<<<< HEAD
              {vehicle.fuel || "Gasolina"}
=======
              {vehicle.seats} seats
>>>>>>> develop
            </li>

            <li>
              <div className="flex flex-col items-center md:col-span-1 text-base mb-1">
                <Image
                  src={ElectricCarIcon}
                  width={35}
                  height={35}
                  alt="transmission"
                />
              </div>
<<<<<<< HEAD
              {vehicle.transmission || "Automática"}
            </li>
          </ul>
        </div>
        {/* 
        <figure className="relative w-full h-full overflow-hidden">
          <Image
            src={vehicle.thumbnailUrl}
=======
              {vehicle.fuel || "Gasolina"}
            </li>

            <li>
              <div className="text-xl mb-1">
                <Image
                  src={ElectricCarIcon}
                  width={60}
                  height={60}
                  alt="transmition"
                />
              </div>
              {vehicle.transmition || "Automática"}
            </li>
          </ul>
        </div>

        <figure className="relative w-full h-full overflow-hidden">
          <Image
            src={vehicle.photo}
>>>>>>> develop
            alt={`Foto del vehículo ${vehicle.make} ${vehicle.model}`}
            sizes="(max-width: 768px) 100vw, 66vw"
            fill
            priority
            className="object-cover object-center"
          />
        </figure> */}
      </section>

<<<<<<< HEAD
      <section className=" bg-custume-light md:col-span-2  h-full p-6 sm:p-8 text-custume-blue text-lg font-hind flex flex-col justify-between">
=======
      <section className=" bg-custume-light md:col-span-1  h-full p-6 sm:p-8 text-custume-blue text-lg font-hind flex flex-col justify-between">
>>>>>>> develop
        <div className="mb-6 overflow-y-auto">
          <p className="mb-4 text-xl leading-relaxed">{vehicle.description}</p>

          <h2 className="text-3xl font-bold mt-6 mb-3 text-custume-blue">
<<<<<<< HEAD
            reglas
=======
            rules
>>>>>>> develop
          </h2>
          <p className="text-xl leading-relaxed whitespace-pre-line">
            {vehicle.rules}
          </p>

          <p className="text-xl font-light text-custume-blue">
            Precio por hora ${(vehicle.pricePerDay / 24).toFixed(1)}{" "}
            <span className="text-sm font-light">USD</span>
          </p>
          <p className="text-xl font-light text-custume-blue">
            Precio por día ${vehicle.pricePerDay}{" "}
            <span className="text-sm font-light">USD</span>
          </p>
          <p className="text-xl font-light text-custume-blue">
            Precio por semana ${(vehicle.pricePerDay * 7).toFixed(1)}{" "}
            <span className="text-sm font-light">USD</span>
          </p>
        </div>

<<<<<<< HEAD
        <div className="flex flex-raw justify-between space-y-3 mt-auto">
          <DarkButton
            className="hover:cursor-pointer"
            size="xl"
=======
        <div className="flex flex-col space-y-3 mt-auto">
          <DarkButton
            className="hover:cursor-pointer"
            size="lg"
>>>>>>> develop
            text="rent now"
          />
          <Link href="/vehicles" passHref>
            <LightButton
              className="hover:cursor-pointer"
<<<<<<< HEAD
              size="xl"
              text="ver todos los vehículos"
=======
              size="lg"
              text="back to vehicles"
>>>>>>> develop
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
