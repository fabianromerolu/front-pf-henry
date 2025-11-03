"use client";

import DarkButtom from "@/components/Buttoms/DarkButtom";
import LightButtom from "@/components/Buttoms/LightButtom";
import MenuBar from "@/components/MenuBar/MenuBar";
import React from "react";

const features = [
  "Experience luxury, comfort, and freedom in every ride.",
  "Our cars, your style; always ready for your next adventure.",
  "Premium service, transparent prices, zero stress.",
  "Drive with confidence. Travel with class.",
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="relative bg-gradient-to-br from-light-blue via-custume-blue to-dark-blue w-full overflow-hidden">
        <div className="absolute inset-0 opacity-5"></div>

        <div className="relative z-10 py-10 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-6 taviraj font-semibold text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight drop-shadow-2xl">
            <h1>Convierte cada viaje en una aventura</h1>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-6">
            <DarkButtom href="/register" size="xl" text="Registrarse" />
            <LightButtom href="/login" size="xl" text="Iniciar Sesión" />
          </div>
        </div>
      </div>

      <div className="bg-custume-light pt-6 py-2">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
            <div className="w-3 h-3 bg-custume-red rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
          </div>
        </div>
      </div>

      <MenuBar />

      <div className="bg-custume-light py-2">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
            <div className="w-3 h-3 bg-custume-red rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
          </div>
        </div>
      </div>

      <div className="bg-custume-light py-6 px-6">
        <h2 className="text-center text-4xl taviraj font-semibold text-custume-red mb-12">
          ¿Por qué elegirnos?
        </h2>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            <div className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent lg:row-span-1">
              <div className="text-center">
                <p className="text-lg text-dark-blue hind leading-relaxed">
                  {features[0]}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-custume-blue to-custume-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>

            <div className="bg-light-blue rounded-2xl lg:row-span-1"></div>

            <div className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent  lg:row-span-1">
              <div className="text-center">
                <p className="text-lg text-dark-blue hind leading-relaxed">
                  {features[1]}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-custume-blue to-custume-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>

            <div className="group relative bg-dark-blue rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent lg:row-span-2 flex items-center">
              <div className="text-center w-full">
                <p className="text-xl text-custume-light hind leading-relaxed">
                  {features[2]}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-custume-light to-custume-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent md:col-span-2 lg:col-span-2 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl text-dark-blue hind leading-relaxed">
                  {features[3]}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-custume-blue to-custume-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>
            <div className="group relative bg-light-blue rounded-2xl p-8 shadow-md transition-all duration-300 transform border-2 border-transparent md:col-span-2 lg:col-span-2 flex items-center justify-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
