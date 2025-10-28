import LightButton from "@/components/Buttoms/LightButtom";
import React from "react";

function page() {
  return (
    <div className="min-h-screen bg-custume-light flex items-center justify-center">
      <div className="text-center">
        <h1 className="taviraj text-5xl md:text-6xl lg:text-7xl text-custume-blue font-bold mb-4">
          Be welcome to Volantia
        </h1>
        <div className="w-32 h-1 bg-light-blue mx-auto mt-6"></div>
        <div className="flex justify-center m-10">
          <LightButton href="/home" size="xl" text="let's start"></LightButton>
        </div>
      </div>
    </div>
  );
}

export default page;
