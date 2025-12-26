"use client";

import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import CreditBlock from "./credit-block";
import { User, Smartphone, XCircle, Clock, MapPin, HandCoins } from "lucide-react";
import type { StaticImageData } from "next/image";

// Imágenes
import bancoBogotaImg from "@/assets/logo/banco-de-bogota.png";
import addiImg from "@/assets/logo/addi.webp";
import goraImg from "@/assets/logo/Gora.png";
import brillaImg from "@/assets/logo/brilla.jpg";

type Requisito = { icon: ReactElement; text: string };
type EntidadId = "banco" | "addi" | "gora" | "brilla";

type Entidad = {
  id: EntidadId;
  title: string;
  image: StaticImageData; // 👈 sin "any"
  description: string;
  buttonText: string;
  buttonLink: string;
  videoId?: string; // 👈 sólo Addi lo usará
};

export default function CreditSection() {
  const [activeTitle, setActiveTitle] = useState("Banco de Bogotá");
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const requisitos = useMemo<Record<EntidadId, Requisito[]>>(
    () => ({
      banco: [
        { icon: <User size={28} />, text: "Cédula (foto clara de ambos lados)" },
        { icon: <Smartphone size={28} />, text: "Celular activo y correo personal" },
        { icon: <XCircle size={28} />, text: "Sin reportes en centrales de riesgo" },
        { icon: <Clock size={28} />, text: "Financiación de 12 a 72 cuotas" },
        { icon: <HandCoins size={28} />, text: "Tener el valor total del financiamiento" },
      ],
      addi: [
        { icon: <User size={28} />, text: "Ser mayor de edad" },
        { icon: <Smartphone size={28} />, text: "Número de celular activo" },
        { icon: <Clock size={28} />, text: "Pagos flexibles y aprobación rápida" },
      ],
      gora: [
        { icon: <User size={28} />, text: "Cédula válida" },
        { icon: <Smartphone size={28} />, text: "Correo personal y número activo" },
        { icon: <Clock size={28} />, text: "Opciones para reportados o sin historial" },
      ],
      brilla: [
        { icon: <MapPin size={28} />, text: "Disponible solo para Popayán" },
        { icon: <User size={28} />, text: "Cliente con cupo Brilla activo" },
        { icon: <Clock size={28} />, text: "Cuotas según tu cupo disponible" },
      ],
    }),
    []
  );

  const entidades = useMemo<Entidad[]>(
    () => [
      {
        id: "banco",
        title: "Banco de Bogotá",
        image: bancoBogotaImg,
        description:
          "En Jake Tienda Electrónica te ayudamos a financiar tu compra con Banco de Bogotá. Crédito 100% en línea, seguro y rápido. Si tu crédito es aprobado, enviamos tu pedido a tu ciudad y solo pagas el costo del envío al recibirlo.",
        buttonText: "Solicitar crédito Banco de Bogotá",
        buttonLink:
          "https://crediconveniodigital.bancodebogota.com.co/pg-landing?productName=LibreDestino&accessedFrom=WEB-ALIADO&utm_content=libre_destino&utm_source=aliadosweb&utm_medium=new_url&sarlaft4=true&newcampaign=false&utm_campaign=jake%20tienda%20electronica&shortlinkId=lwjqqbfe",
      },
      {
        id: "addi",
        title: "Addi",
        image: addiImg,
        description:
          "Compra ahora y paga después con cuotas cómodas y aprobación rápida.",
        buttonText: "Escríbenos por WhatsApp",
        buttonLink:
          "https://wa.me/573103876150?text=Hola%2C%20quiero%20información%20sobre%20financiación%20con%20Addi",
        videoId: "ritY6TpjuD4", // 👈 reemplaza por el ID real
      },
      {
        id: "gora",
        title: "Gora",
        image: goraImg,
        description:
          "Financiación flexible para clientes sin historial crediticio o reportados.",
        buttonText: "Escríbenos por WhatsApp",
        buttonLink:
          "https://wa.me/573103876150?text=Hola%2C%20quiero%20información%20sobre%20financiación%20con%20Gora",
      },
      {
        id: "brilla",
        title: "Brilla",
        image: brillaImg,
        description:
          "Financia tus compras con tu cupo Brilla... acércate con tu recibo de la energia.",
        buttonText: "Escríbenos por WhatsApp",
        buttonLink:
          "https://wa.me/573103876150?text=Hola%2C%20quiero%20información%20sobre%20financiación%20con%20Brilla",
      },
    ],
    []
  );

  // Observa qué bloque está visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const found = entidades.find(
              (e) => e.id === entry.target.getAttribute("data-id")
            );
            if (found) setActiveTitle(found.title);
          }
        });
      },
      { threshold: 0.6 }
    );

    sectionsRef.current.forEach((sec) => {
      if (sec) observer.observe(sec);
    });

    return () => observer.disconnect();
  }, [entidades]); // entidades ya está memorizado

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12 text-black">
      <h1 className="mb-20 text-center text-4xl font-bold text-black">
        Formas de financiamiento
      </h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-40 ml-8">
            <h2 className="text-3xl font-bold text-cyan-600">{activeTitle}</h2>
          </div>
        </div>

        <div className="flex flex-col space-y-32 lg:col-span-2">
          {entidades.map((entidad, idx) => (
            <div
              key={entidad.id}
              data-id={entidad.id}
              ref={(el) => {
                // IMPORTANTE: no retornes nada aquí
                sectionsRef.current[idx] = el;
              }}
            >
              <CreditBlock
                title={entidad.title}
                image={entidad.image}
                description={entidad.description}
                cards={requisitos[entidad.id]}
                buttonText={entidad.buttonText}
                buttonLink={entidad.buttonLink}
                videoId={entidad.videoId} // 👈 video para Addi
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
