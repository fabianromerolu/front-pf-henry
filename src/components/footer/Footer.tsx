"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full text-[var(--color-custume-light)] bg-[linear-gradient(to_right,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + desc */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-4 inline-block" aria-label="Go to homepage">
              <Image
                src="/lightLogo.png"
                alt="Volantia"
                width={120}
                height={120}
                sizes="120px"
                priority
                className="object-contain"
              />
            </Link>

            <p className="text-sm text-center md:text-left opacity-90">
              Your destination for travel. Volantia 2025.
            </p>

            {/* Social */}
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="transition-colors hover:text-[var(--color-light-blue)]"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="transition-colors hover:text-[var(--color-light-blue)]"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="transition-colors hover:text-[var(--color-light-blue)]"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="transition-colors hover:text-[var(--color-light-blue)]"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* About us */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-lg font-bold text-[var(--color-light-blue)]">About Us</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-light-blue)] hover:underline">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-light-blue)] hover:underline">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-light-blue)] hover:underline">
                  Work With Us
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-light-blue)] hover:underline">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          {/* Useful info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-lg font-bold text-[var(--color-light-blue)]">Useful Information</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-light-blue)] hover:underline">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-light-blue)] hover:underline">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-light-blue)] hover:underline">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-light-blue)] hover:underline">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-lg font-bold text-[var(--color-light-blue)]">Contact</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-90">Email:</span>
                <a
                  href="mailto:trabajofinal866@gmail.com"
                  className="opacity-90 hover:text-[var(--color-light-blue)] hover:underline"
                >
                  trabajofinal866@gmail.com
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-90">Phone:</span>
                <a
                  href="tel:+573112708453"
                  className="opacity-90 hover:text-[var(--color-light-blue)] hover:underline"
                >
                  +54 627 113 3427
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-90">Hours:</span>
                <span className="opacity-90">Mon–Fri: 9am – 6pm</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-90">Location:</span>
                <span className="opacity-90">Mexico</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm opacity-80">© 2025 Volantia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
