import LightButtom from "@/components/Buttoms/LightButtom";
import DarkButtom from "@/components/Buttoms/DarkButtom";

import MenuBar from "@/components/MenuBar/MenuBar";
import React from "react";

export default function Home() {
  return (
    <div>
      <div className="bg-light-blue w-full h-30">
        <h2 className="flex justify-center text-4xl montserrat mb-6 text-dark-blue text-bold">
          Convierte cada viaje en una experiencia{" "}
        </h2>
      </div>

      <div className="flex justify-center items-center gap-6 mt-10 mb-16">
        <DarkButtom href="/register" size="xl" text="registro" />
        <LightButton href="/login" size="xl" text="iniciar sesión" />
      </div>

      <MenuBar />
    </div>
  );
}
