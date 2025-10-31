"use client";
import Image from "next/image"; 
import Link from "next/link";
import DarkButton from "@/components/Buttoms/DarkButtom";
import LightButton from "@/components/Buttoms/LightButtom";
import VehicleProps from "@/interfaces/vehicleProps";

interface VehicleDetailProps {
  vehicle: VehicleProps;
}

const SteeringWheelIcon = "/icons/steeringWheel.svg";
const ElectricCarIcon = "/icons/electricCar.svg";
const PetrolPumpIcon = "/icons/petrolPump.svg";
const SeatsIcon = "/icons/seats.svg";


export default function VehicleDetail({ vehicle }: VehicleDetailProps) {
  

  return (
    
    <main className="grid md:grid-cols-3 text-custume-light  max-w-7xl mx-auto shadow-xl min-h-[50rem]">
    
      <section className="md:col-span-2 bg-dark-blue font-montserrat text-custume-light grid grid-rows-[50%_50%] h-full">
        
        
        <div className="flex flex-col  text-custume-light p-6 sm:p-8">
          
          <header className="flex justify-between items-start mb-6 p-6">
      
            
            <h1 className="font-normal tracking-tight"> 
              
              <span className="text-4xl font-light block"> 
                {vehicle.make}
              </span>
             
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
                <Image src={SteeringWheelIcon} width={60} height={60} alt="steering-Wheel" />
              </div>
              {vehicle.bodytype || "SUV"} 
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
                <Image src={ElectricCarIcon} width={60} height={60} alt="transmition" />
              </div>
              {vehicle.transmition || "Automática"}
            </li>
            
          </ul>
        </div>

        
        <figure className="relative w-full h-full overflow-hidden">
          <Image
            src={vehicle.photo} 
            alt={`Foto del vehículo ${vehicle.make} ${vehicle.model}`}
            sizes="(max-width: 768px) 100vw, 66vw" 
            fill
            priority 
            className="object-cover object-center"
          />
        </figure>
      </section>

      
      <section className=" bg-custume-light md:col-span-1  h-full p-6 sm:p-8 text-custume-blue text-lg font-hind flex flex-col justify-between">
        
        <div className="mb-6 overflow-y-auto">
          
          <p className="mb-4 text-xl leading-relaxed">
            {vehicle.description}
          </p>

          <h2 className="text-3xl font-bold mt-6 mb-3 text-custume-blue">rules</h2>
          <p className="text-xl leading-relaxed whitespace-pre-line">
            {vehicle.rules}
          </p>
        </div>

        
        <div className="flex flex-col space-y-3 mt-auto">
          <DarkButton className="hover:cursor-pointer" size="lg" text="rent now" />
          <Link href="/vehicles" passHref>
            <LightButton className="hover:cursor-pointer" size="lg" text="back to vehicles"/>
          </Link>
        </div>
  </section>
</main>
  );
}