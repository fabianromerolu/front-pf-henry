"use client";

import DarkButtom from "@/components/Buttoms/DarkButtom";
import LightButtom from "@/components/Buttoms/LightButtom";
import ReviewCard from "@/components/cards/reviewCard";
import MenuBar from "@/components/MenuBar/MenuBar";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const features = [
  "Experimenta lujo, comodidad y libertad en cada viaje.",
  "Nuestros autos, tu estilo; siempre listos para tu próxima aventura.",
  "Servicio premium, precios transparentes, cero estrés.",
  "Conduce con confianza. Viaja con clase.",
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="relative bg-gradient-to-br from-light-blue via-custume-blue to-dark-blue w-full overflow-hidden">
        <div className="absolute inset-0 opacity-5"></div>

        <div className="relative z-10 py-10 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-6 taviraj font-semibold text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight drop-shadow-2xl">
            <h1>Convierte cada viaje en una aventura</h1>
          </div>
          {!user && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-6">
              <DarkButtom href="/register" size="xl" text="Registrarse" />
              <LightButtom href="/login" size="xl" text="Iniciar Sesión" />
            </div>
          )}
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
      <div className="max-w-6xl mx-auto pt-0 p-6">
        <h2 className="text-center text-4xl taviraj font-semibold text-custume-red mb-12">
          ¿Qué estás buscando?
        </h2>

        <div className="flex justify-center mb-10">
          <LightButtom
            href="/vehicles"
            size="xl"
            text="Vehículos disponibles"
          />
        </div>
        <MenuBar />
      </div>

      <div className="bg-custume-light py-10">
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
        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-3 gap-6 auto-rows-fr min-w-[900px]">
            <div className="group relative bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 lg:row-span-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-custume-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center">
                <p className="text-lg text-dark-blue hind leading-relaxed">
                  {features[0]}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-custume-blue via-light-blue to-custume-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>

            <div className="bg-gradient-to-br from-light-blue via-custume-blue to-light-blue rounded-2xl lg:row-span-1 shadow-lg hover:shadow-xl transition-all duration-300"></div>

            <div className="group relative bg-gradient-to-br from-white via-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 lg:row-span-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-light-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center">
                <p className="text-lg text-dark-blue hind leading-relaxed">
                  {features[1]}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-custume-blue via-light-blue to-custume-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>

            <div className="group relative bg-gradient-to-br from-dark-blue via-custume-blue to-dark-blue rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-dark-blue lg:row-span-2 flex items-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-custume-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center w-full">
                <p className="text-xl text-custume-light hind leading-relaxed">
                  {features[2]}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-custume-light via-light-blue to-custume-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>

            <div className="group relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 md:col-span-2 lg:col-span-2 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-custume-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center">
                <p className="text-xl text-dark-blue hind leading-relaxed">
                  {features[3]}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-custume-blue via-custume-red to-custume-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>

            <div className="group relative bg-gradient-to-br from-light-blue via-custume-blue to-light-blue rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-light-blue md:col-span-2 lg:col-span-2 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
            </div>
          </div>
        </div>

        <div className="bg-custume-light py-10 mt-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
              <div className="w-3 h-3 bg-custume-red rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
            </div>
          </div>
        </div>

        <h2 className="text-center text-3xl sm:text-4xl taviraj font-semibold text-custume-red my-12">
          ¿Qué dicen de nosotros?
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 my-8">
          <ReviewCard
            userName="Juan Pérez"
            comment="Excelente experiencia alquilando un auto. El vehículo estaba impecable, limpio y tal como se mostraba en las fotos. El propietario fue muy puntual y amable. El proceso de entrega y devolución fue súper rápido. ¡Totalmente recomendado!"
            rating={5}
          />
          <ReviewCard
            userName="María González"
            comment="Muy buena experiencia en general. El auto funcionó perfectamente durante todo el viaje y consumió poco combustible. El dueño me explicó todo con detalle y fue muy flexible con los horarios. Solo le faltaba un poco de limpieza interior."
            rating={4}
          />
          <ReviewCard
            userName="Fernando Álvarez"
            comment="Buen servicio y auto confiable. La comunicación con el propietario fue fluida y me ayudó con algunas dudas sobre rutas. El vehículo estaba en buen estado mecánico, aunque el sistema de audio podría mejorar. Lo volvería a rentar."
            rating={4}
          />
        </div>
      </div>
    </div>
  );
}
