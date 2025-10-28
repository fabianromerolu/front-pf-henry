// import Image from "next/image";
import DarkButtom from "@/components/Buttoms/DarkButtom";
import LightButtom from "@/components/Buttoms/LightButtom";
import MenuBar from "@/components/MenuBar/MenuBar";
import React from "react";

function Home() {
  return (
    <div>
      <div className="bg-light-blue w-full h-1"></div>
      <div className="flex justify-center items-center gap-6 mt-10">
        <DarkButtom href="/register" size="xl" text="register" />
        <LightButtom href="/login" size="xl" text="log in" />
      </div>
      <MenuBar />
    </div>
  );
}

export default Home;
