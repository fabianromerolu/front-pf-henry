"use client";
import Image from "next/image";
import Link from "next/link";
import DarkButton from "@/components/Buttoms/DarkButtom";
import LightButton from "@/components/Buttoms/LightButtom";
import VehicleProps from "@/interfaces/vehicleProps";
import ReviewCard from "../cards/reviewCard";

interface VehicleDetailProps {
  vehicle: VehicleProps;
}

const SteeringWheelIcon = "/icons/steeringWheel.svg";
const ElectricCarIcon = "/icons/electricCar.svg";
const PetrolPumpIcon = "/icons/petrolPump.svg";
const SeatsIcon = "/icons/seats.svg";

export default function VehicleDetail({ vehicle }: VehicleDetailProps) {
  return (
    <main className="grid grid-cols-[40%_60%] min-h-[60rem] shadow-xl text-custume-light">
      <section className=" bg-dark-blue font-montserrat text-custume-light grid grid-rows-[40%_60%] h-full">
        <div className="flex flex-col text-custume-light p-6 sm:p-8">
          <header className="flex justify-between items-start p-6">
            <h1 className="font-normal tracking-tight">
              <span className="text-4xl font-light block">{vehicle.make}</span>
              <span className="text-2xl font-light block">{vehicle.model}</span>

              <p className="mt-6 text-2xl font-light text-custume-gray">
                Precio por día ${vehicle.pricePerDay}
              </p>
            </h1>
          </header>

          <ul className="flex justify-start space-x-8 p-6 text-center mt-auto text-custume-light/70">
            <li>
              <div className="text-xl mb-1">
                <Image
                  src={SteeringWheelIcon}
                  width={60}
                  height={60}
                  alt="steering-Wheel"
                />
              </div>
              {vehicle.bodyType || "SUV"}
            </li>

            <li>
              <div className="text-xl mb-1">
                <Image src={SeatsIcon} width={60} height={60} alt="seats" />
              </div>
              {vehicle.seats} seats
            </li>

            <li>
              <div className="text-xl mb-1">
                <Image src={PetrolPumpIcon} width={60} height={60} alt="pump" />
              </div>
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
              {vehicle.transmission || "Automática"}
            </li>
          </ul>
        </div>

        <figure className="relative w-full h-full overflow-hidden">
          <Image
            src={vehicle.thumbnailUr}
            alt={`Foto del vehículo ${vehicle.make} ${vehicle.model}`}
            sizes="(max-width: 768px) 100vw, 66vw"
            fill
            priority
            className="object-cover object-center"
          />
        </figure>
      </section>

      <section className="bg-custume-light h-full p-6 sm:p-8 text-custume-blue text-lg font-hind flex flex-col">
        <div className="mb-6 overflow-y-auto">
          <p className="mb-4 text-xl leading-relaxed">
            {vehicle.description} El Toyota Corolla es un sedán que combina
            elegancia, eficiencia y confiabilidad, ideal para todo tipo de
            trayectos, desde viajes urbanos hasta recorridos largos por
            carretera. Su diseño moderno destaca por líneas aerodinámicas y
            detalles refinados que transmiten un estilo sofisticado. En el
            interior, ofrece un ambiente cómodo y silencioso con asientos
            ergonómicos, materiales de alta calidad y un amplio espacio para
            pasajeros y equipaje. Su tecnología intuitiva incluye pantalla
            táctil, conectividad con Apple CarPlay y Android Auto, y un sistema
            de sonido envolvente que mejora la experiencia de conducción.
          </p>

          <h2 className="text-3xl font-bold mt-5 mb-3 text-custume-blue">
            Reglas
          </h2>
          <p className="text-xl leading-relaxed whitespace-pre-line">
            <span>º Prohibido fumar dentro del vehículo.</span>
            <br />
            <span>º Devolver el auto con el mismo nivel de combustible.</span>
            <br />
            <span>º Cumplir con los horarios de entrega y devolución.</span>
          </p>
        </div>

        <div className="flex flex-row gap-4">
          <ReviewCard
            userName="Juan Pérez"
            comment="Excelente servicio, el auto estaba en perfectas condiciones y la atención fue de primera. Definitivamente volveré a rentar aquí."
            rating={5}
          />

          <ReviewCard
            userName="Carlos Ramírez"
            comment="La experiencia fue regular. El auto funcionó bien pero llegó con el tanque casi vacío y tuve que cargar gasolina de inmediato. La atención al cliente podría mejorar, tardaron en responder mis mensajes."
            rating={3}
          />
        </div>

        <div className="flex flex-row gap-4 mt-8">
          <DarkButton
            className="hover:cursor-pointer"
            size="xl"
            text="rent now"
          />
          <Link href="/vehicles" passHref>
            <LightButton
              className="hover:cursor-pointer"
              size="xl"
              text="back to vehicles"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
