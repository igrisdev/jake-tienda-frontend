"use client";

// import Image from "next/image";

import logoImg from "@/assets/images/logo.png";

import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

// Ícono personalizado de TikTok (SVG)
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.5 2c.6 0 1.1 0 1.6.1.2 2.2 1.8 4.1 4 4.5v2.2c-1.4-.1-2.7-.6-3.8-1.4v7.2a5.6 5.6 0 1 1-5.6-5.6c.2 0 .5 0 .7.1v2.3a3.3 3.3 0 1 0 2.6 3.3V2z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-gradient-to-b from-blue-800 via-blue-800 to-blue-700 px-6 py-12 text-white lg:px-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-4 md:items-start">
        {/* Logo y descripción */}
        <div className="flex flex-col items-center space-y-3 md:items-start">
          {/* <Image
            src={logoImg ?? "/not-found.png"}
            alt="Jake Tienda Electrónica"
            width={160}
            height={60}
            priority
          /> */}
          <img
            src={logoImg.src ?? "/not-found.png"}
            alt="Jake Tienda Electrónica"
            className="h-[60px] w-[160px]"
          />
          <p className="text-center text-sm md:text-left">
            Tu tienda de tecnología y sonido en Popayán. Productos de calidad,
            asesoría profesional y crédito accesible.
          </p>
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col items-center space-y-2 md:items-start">
          <h3 className="text-lg font-semibold">Síguenos</h3>
          <div className="flex space-x-5">
            <a
              href="https://www.facebook.com/jaketiendaelectronicapop?mibextid=wwXIfr&rdid=k5Z36exGZj1uEGRO&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16nZduLArp%2F%3Fmibextid%3DwwXIfr#"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-800 p-2 transition hover:bg-blue-600"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/jaketiendaelectronica?igsh=MWZhdjR5ajBnd3Vu&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-800 p-2 transition hover:bg-pink-500"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.tiktok.com/@jaketiendaelectronica?_t=ZS-8xixwJENN3q&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-800 p-2 transition hover:bg-blue-400"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex flex-col space-y-2 text-center md:text-left">
          <h3 className="text-lg font-semibold text-white">Ubicación</h3>
          <div className="flex items-center justify-center space-x-2 md:justify-start">
            <MapPin size={18} />
            <span>Calle 6 #10-09, Centro de Popayán</span>
          </div>
        </div>

        {/* Contacto */}
        <div className="flex flex-col space-y-2 text-center md:text-left">
          <h3 className="text-lg font-semibold text-white">Contáctanos</h3>
          <div className="flex items-center justify-center space-x-2 md:justify-start">
            <Phone size={18} />
            <span>+57 310 387 6150</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs md:justify-start">
            <Mail size={18} />
            <span>jaketiendaelectronicapopayan@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-10 border-t border-white pt-6 text-center text-sm">
        © {new Date().getFullYear()} Jake Tienda Electrónica. Todos los
        derechos reservados.
      </div>
    </footer>
  );
}
