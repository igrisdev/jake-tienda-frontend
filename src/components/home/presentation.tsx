"use client";

import Link from "next/link";
import { ICarouselPresentation } from "@/types/home";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import {
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Truck,
  Percent,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "@/styles/home/presentation.css";

export const Presentation = ({
  presentations,
}: {
  presentations: ICarouselPresentation[];
}) => {
  return (
    <section className="mx-auto mt-6 mb-16 max-w-7xl px-6 md:mb-24 lg:mb-12 lg:px-10">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        {/* Columna izquierda (texto) */}
        <div className="order-2 flex flex-col gap-10 lg:order-1">
          <span className="w-fit rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700">
            Tienda #1 en Electrónica
          </span>

          <h1 className="text-4xl leading-tight font-extrabold text-gray-900 md:text-5xl">
            Jake Tienda Electrónica
          </h1>

          <p className="max-w-xl text-base text-gray-600">
            Audio profesional, controladoras DJ, subwoofers y tecnología.
            <br />
            Compra con financiación y envío a toda Colombia.
          </p>

          {/* Botones con íconos */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700"
            >
              <ShoppingBag size={18} />
              Explorar productos
            </Link>
            <Link
              href="/credito"
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
            >
              <CreditCard size={18} />
              Opciones de financiación
            </Link>
          </div>

          {/* Lista con íconos */}
          <ul className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" />
              Garantía extendida
            </li>
            <li className="flex items-center gap-2">
              <Truck size={18} className="text-blue-600" />
              Envío gratis
            </li>
            <li className="flex items-center gap-2">
              <Percent size={18} className="text-blue-600" />
              Financiación 0%
            </li>
          </ul>
        </div>

        {/* Columna derecha (carrusel) — OCULTO EN MÓVILES */}
        <div className="order-1 hidden md:block lg:order-2">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 md:h-[360px] lg:h-[480px] xl:h-[560px]">
            <Swiper
              spaceBetween={0}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              loop
              modules={[Autoplay, Pagination, Navigation]}
              className="h-full w-full"
            >
              {presentations.map((p) => (
                <SwiperSlide key={p.id}>
                  <Link
                    href={`/view-product/${p.slug}`}
                    className="block h-full w-full"
                  >
                    <img
                      src={p.url}
                      alt={p.name_image}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};
