'use client';

import { useState } from 'react';
import Image from 'next/image';
 
//icons
const VehicleIcon = '/icons/vehicles.svg'; 
const OfferIcon = '/icons/offer.svg';
const ContactIcon = '/icons/contact.svg';
const ProfileIcon = '/icons/profile.svg';
const LogoutIcon = '/icons/logout.svg';
const Logo = 'logo.svg';


const NavLinks = [
  { name: 'vehicles', href: '/vehicles', icon: VehicleIcon },
  { name: 'offer', href: '/offer', icon: OfferIcon },
  { name: 'contact', href: '/contact', icon: ContactIcon },
  { name: 'profile', href: '/profile', icon: ProfileIcon },
];

export default function Navbar() {
    
  const [isOpen, setIsOpen] = useState(false);

  // Función para manejar el clic en "Log out"
  const handleLogout = () => {
    // Aquí iría la lógica de deslogueo (ej. borrar token, redireccionar)
    console.log("Usuario deslogueado");
    setIsOpen(false); // Cierra el menú después de la acción
  };

  return (
    <header className="flex justify-between items-center px-4 md:px-8 bg-blue-100 shadow-md">
      {/* 1. LOGOTIPO (Izquierda) */}
      <div className="flex items-center">
        <Image src={Logo} alt="VOLANTIA Logo" width={120} height={40} className="h-auto" />
      </div>

      {/* 2. Botón de Menú HAMBURGUESA (Derecha) */}
      <button 
        onClick={() => setIsOpen(true)} // Abre el menú
        className="text-blue-900 focus:outline-none"
        aria-label="Open Menu"
      >
        {/* Icono de menú de 3 barras */}
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18h18v-2H3v2zM3 13h18v-2H3v2zM3 6v2h18V6H3z"/>
        </svg>
      </button>

      {/* 3. MENÚ LATERAL DESPLEGABLE (<nav>) */}
      {/* Overlay Oscuro (se muestra si isOpen es true) */}
      <div
        className={`fixed inset-0 bg-white/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={() => setIsOpen(false)} // Cierra al hacer clic fuera
      />

      <nav
        className={`fixed top-0 right-0 w-80 h-full bg-white p-6 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`} // Ocultar completamente en desktop si no se usa
        aria-labelledby="mobile-menu-heading"
      >
        {/* Encabezado: Botón de Cerrar (X) */}
        <div className="flex justify-end mb-8">
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Lista de Enlaces */}
        <ul className="space-y-6">
          {NavLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="flex items-center text-lg text-gray-700 hover:text-indigo-600 capitalize">
                <Image src={link.icon} alt={`${link.name} icon`} width={24} height={24} className="mr-4" />
                {link.name}
              </a>
            </li>
          ))}
          
          {/* Botón de Log Out (en la parte inferior) */}
          <li className="pt-8">
            <button 
              onClick={handleLogout}
              className="flex items-center text-lg text-red-500 hover:text-red-700 w-full text-left capitalize"
            >
              <Image src={LogoutIcon} alt="Log out icon" width={24} height={24} className="mr-4" />
              log out
            </button>
          </li>
        </ul>
      </nav>
      
    </header>
  );
}