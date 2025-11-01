import DarkButton from "@/components/buttons/DarkButton";
import LightButton from "@/components/buttons/LightButton";
import MenuBar from "@/components/menubar/MenuBar";
import React from "react";

export default function Home() {
  return (
    <div>
      <div className="bg-light-blue w-full h-30">
        <h2 className="flex justify-center text-4xl montserrat mb-6 text-dark-blue text-bold">
          Convierte cada viaje en una experiencia nueva{" "}
        </h2>
      </div>

      <div className="flex justify-center items-center gap-6 mt-10 mb-16">
        <DarkButton href="/register" size="xl" text="registro" />
        <LightButton href="/login" size="xl" text="iniciar sesión" />
      </div>

      <MenuBar />
    </div>
  );
}
