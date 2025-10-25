// src/components/navbar/Navbar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

// Icons
const VehicleIcon = "/icons/vehicles.svg";
const OfferIcon = "/icons/offer.svg";
const ContactIcon = "/icons/contact.svg";
const ProfileIcon = "/icons/profile.svg";
const LogoutIcon = "/icons/logout.svg";
const Logo = "logo.svg";

// Enlaces base (públicos)
const NavLinksBase = [
  { name: "vehicles", href: "/vehicles", icon: VehicleIcon },
  { name: "offer", href: "/offer", icon: OfferIcon },
  { name: "contact", href: "/contact", icon: ContactIcon },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const AuthLinks = [{ name: "profile", href: "/profile", icon: ProfileIcon }];

  const allNavLinks = isLoggedIn ? [...NavLinksBase, ...AuthLinks] : NavLinksBase;

  const handleLogout = () => {
    console.log("Usuario deslogueado");
    setIsLoggedIn(false);
    setIsOpen(false);
  };

  const handleLogin = () => {
    console.log("Usuario logueado");
    setIsLoggedIn(true);
    setIsOpen(false);
  };

  return (
    <header className="flex justify-between items-center h-18 px-4 md:px-8 bg-light-blue shadow-md">
      <div className="flex items-center mt-2">
        <Image src={Logo} alt="VOLANTIA Logo" width={120} height={40} className="h-auto" />
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-900 focus:outline-none hover:cursor-pointer"
        aria-label="Open Menu"
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zM3 13h18v-2H3v2zM3 6v2h18V6H3z" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 bg-white/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      />

      <nav
        className={`fixed top-0 right-0 w-72 h-full bg-[#f6f7fb] p-8 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-labelledby="mobile-menu-heading"
      >
        {/* BOTÓN CERRAR */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ENLACES */}
        <ul className="space-y-4">
          {allNavLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="group relative flex items-center gap-4 pl-6 pr-6 py-3 text-[#787A91] text-lg capitalize transition-all duration-200 hover:text-[#0F044C] hover:bg-white hover:shadow-md w-full rounded-md"
              >
                <span className="absolute left-0 top-0 h-full w-[4px] bg-[#0F044C] opacity-0 group-hover:opacity-100 rounded-r-sm"></span>

                <Image
                  src={link.icon}
                  alt={`${link.name} icon`}
                  width={26}
                  height={26}
                  className="opacity-80 group-hover:opacity-100 transition-opacity duration-150"
                />

                <span>{link.name}</span>
              </a>
            </li>
          ))}

          {isLoggedIn ? (
            <li className="pt-6">
              <button
                onClick={handleLogout}
                className="group relative flex items-center gap-4 pl-6 pr-6 py-3 text-[#787A91] text-lg capitalize transition-all duration-200 hover:text-red-600 hover:bg-white hover:shadow-md w-full rounded-md"
              >
                <span className="absolute left-0 top-0 h-full w-[4px] bg-red-600 opacity-0 group-hover:opacity-100 rounded-r-sm"></span>

                <Image
                  src={LogoutIcon}
                  alt="Log out icon"
                  width={26}
                  height={26}
                  className="opacity-80 group-hover:opacity-100 transition-opacity duration-150"
                />

                <span>log out</span>
              </button>
            </li>
          ) : (
            <li className="pt-6">
              <button
                onClick={handleLogin}
                className="flex items-center gap-4 text-green-500 hover:text-green-700 text-lg capitalize px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-md w-full"
              >
                <Image src={ProfileIcon} alt="Log in icon" width={26} height={26} className="opacity-80" />
                <span>log in</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
