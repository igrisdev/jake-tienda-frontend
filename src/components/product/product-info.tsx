"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Landmark, MessageCircle, Info, X } from "lucide-react";

import { Product } from "@/lib/shopify/types";
import Price from "../price";
import { AddToCart } from "../cart/add-to-cart";
import bancoBogotaImg from '@/assets/logo/banco-de-bogota.png';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "573103876150";
const BANCO_BOGOTA_URL =
  process.env.NEXT_PUBLIC_BANCO_BOGOTA_URL ||
  "https://slm.bancodebogota.com/lwjqqbfe";

const ADDI_PREAPPROVAL_URL =
  process.env.NEXT_PUBLIC_ADDI_URL || "https://co.addi.com/";

const ADDI_RATE = 0.05; // +5%
const DIRECT_DISCOUNT = 0.04; // -4%



export const ProductInfo = ({ product }: { product: Product }) => {
  const [showAddiModal, setShowAddiModal] = useState(false);
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [showBancoModal, setShowBancoModal] = useState(false);
  const [confirmDirect, setConfirmDirect] = useState(false);
  const [showAddiVideoModal, setShowAddiVideoModal] = useState(false);

  const baseAmount = useMemo(
    () => parseFloat(product.priceRange.maxVariantPrice.amount),
    [product.priceRange.maxVariantPrice.amount],
  );
  const currency = product.priceRange.maxVariantPrice.currencyCode;

  const addiTotal = useMemo(
    () => +(baseAmount * (1 + ADDI_RATE)).toFixed(2),
    [baseAmount],
  );

  const directDiscountTotal = useMemo(
    () => +(baseAmount * (1 - DIRECT_DISCOUNT)).toFixed(2),
    [baseAmount],
  );

  const directWhatsAppHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, estoy interesado en el producto "${product.title}" y quiero pagarlo con pago directo. Precio con descuento: ${directDiscountTotal.toLocaleString(
      "es-CO",
      { style: "currency", currency },
    )}.`,
  )}`;

 const addiWhatsAppHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  `Hola, quiero financiar mi compra del producto "${product.title}" con Addi. El valor total del producto con el incremento del 5% es ${(
    baseAmount * 1.05
  ).toLocaleString("es-CO", { style: "currency", currency })}.`
)}`;



  // Cerrar modal con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddiModal(false);
        setShowDirectModal(false);
        setShowBancoModal(false);
      }
    };
    if (showAddiModal || showDirectModal || showBancoModal)
      window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAddiModal, showDirectModal, showBancoModal]);

  return (
    <div className="flex w-full flex-col space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

      {/* === BLOQUE 1: Pago en línea === */}
      <div className="flex flex-col gap-3 rounded border border-gray-300 p-4">
        <Price
          className="text-2xl font-semibold text-gray-800"
          amount={baseAmount.toFixed(2)}
          currencyCode={currency}
        />
        <p className="text-sm text-gray-600">
          Pago en línea (Tarjeta • PSE • Nequi • etc)
        </p>
        <AddToCart product={product} />
      </div>

      {/* === BLOQUE 2: Pago directo === */}
      <div className="flex flex-col gap-3 rounded border border-gray-300 p-4">
        <p className="text-2xl font-semibold text-gray-800">descuento del 4%</p>
        <p className="text-sm text-gray-600">
          Transferencia bancaria <span>(transferencia de Bancolombia, Nequi, Daviplata, etc)</span>
        </p>
        <button
          onClick={() => setShowDirectModal(true)}
          className="flex w-full items-center justify-center rounded-sm bg-green-600 p-3 text-center text-white transition hover:bg-green-700"
        >
          <MessageCircle size={20} className="mr-2" />
          Más información
        </button>
      </div>

      {/* === BLOQUE 3: Crédito Banco de Bogotá === */}
      <div className="flex flex-col gap-3 rounded border border-gray-300 p-4">
        <Price
          className="text-2xl font-semibold text-gray-800"
          amount={baseAmount.toFixed(2)}
          currencyCode={currency}
        />
        <p className="text-sm text-gray-600">
          Solicita tu crédito directamente con Banco de Bogotá
        </p>
        <button
          onClick={() => setShowBancoModal(true)}
          className="flex w-full items-center justify-center rounded-sm bg-blue-600 p-3 text-center text-white transition hover:bg-blue-700"
        >
          <Landmark size={20} className="mr-2" />
          Solicitar crédito Banco de Bogotá
        </button>
      </div>

      {/* === BLOQUE 4: Addi (+5%) === */}
      <div className="flex flex-col gap-3 rounded border border-gray-300 p-4">
        <Price
          className="text-2xl font-semibold text-gray-800"
          amount={addiTotal.toFixed(2)}
          currencyCode={currency}
        />
        <p className="text-sm text-gray-600">
          Financia tu compra con Addi (+5%)
        </p>
        <button
          onClick={() => setShowAddiModal(true)}
          className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
        >
          Financiar con Addi
        </button>
      </div>

      {/* === INFO: Brilla y Gora === */}
      <div className="flex items-start gap-3 rounded border border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
        <Info size={18} className="mt-0.5 flex-shrink-0" />
        <p>
          <span className="font-semibold">Brilla</span> y{" "}
          <span className="font-semibold">Gora</span> se gestionan directamente
          en nuestra tienda fisica, la direccion es:{" "}
          <span className="font-semibold">
            Calle 6 #10-09, Centro de Popayán.
          </span>
        </p>
      </div>

    {/* === MODAL ADDI === */}
{showAddiModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Fondo oscuro */}
    <button
      aria-label="Cerrar"
      className="absolute inset-0 bg-black/50"
      onClick={() => setShowAddiModal(false)}
    />
    {/* Contenedor principal */}
    <div className="animate-fadeIn relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      {/* Botón cerrar */}
      <button
        onClick={() => setShowAddiModal(false)}
        className="absolute top-3 right-3 rounded p-1 text-gray-500 hover:bg-gray-100"
        aria-label="Cerrar"
      >
        <X size={20} />
      </button>

      {/* Contenido */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Financia tu compra con Addi
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Para poder aplicar, asegúrate de cumplir con los siguientes requisitos:
        </p>
      </div>

      <ol className="mb-6 list-inside list-decimal space-y-3 text-gray-700">
        <li>Ser mayor de edad y tener documento de identidad colombiano.</li>
        <li>Tener un celular con acceso a WhatsApp para la verificación.</li>
        <li>Tener dirección de correo electrónico válida.</li>
        <li>La compra debe tener un valor mínimo de $50.000 pesos colombianos.</li>
      </ol>

      {/* Botón para abrir video */}
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Mira este breve video para conocer cómo crear tu crédito con Addi:
        </p>
        <button
          onClick={() => {
            setShowAddiModal(false); // 🔸 Cierra el modal Addi
            setTimeout(() => setShowAddiVideoModal(true), 300); // 🔸 Abre el video
          }}
          className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
        >
          Ver video explicativo
        </button>
      </div>

      {/* Botón continuar */}
      <button
        onClick={() => (window.location.href = addiWhatsAppHref)} // ✅ SOLO redirige a WhatsApp
        className="w-full rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition-all hover:bg-yellow-500"
      >
        Entendí la información y deseo continuar
      </button>

      <p className="mt-3 text-center text-xs text-gray-500">
        Serás redirigido a WhatsApp para hablar con un asesor de Addi.
      </p>
    </div>
  </div>
)}

{/* === MODAL DEL VIDEO === */}
{showAddiVideoModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
    {/* Fondo oscuro */}
    <button
      aria-label="Cerrar video"
      className="absolute inset-0 bg-black/60"
      onClick={() => setShowAddiVideoModal(false)}
    />
    {/* Contenedor del video */}
    <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
      <button
        onClick={() => setShowAddiVideoModal(false)}
        className="absolute top-2 right-2 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
        aria-label="Cerrar"
      >
        <X size={20} />
      </button>

      <video
        src="/movies/addi.mp4"
        controls
        className="w-full rounded-lg border border-gray-300 shadow-sm max-h-[70vh] object-contain"
      >
        Tu navegador no soporta el video.
      </video>

      <p className="mt-3 text-xs text-center text-gray-500">
        Guía oficial de Addi sobre cómo crear y usar tu crédito.
      </p>
    </div>
  </div>
)}

{/* ===== MODAL VIDEO ADDI (modal independiente, compacto) ===== */}
{showAddiVideoModal && (
 <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">

    {/* fondo */}
    <button
      aria-label="Cerrar video"
      className="absolute inset-0 bg-black/60"
      onClick={() => setShowAddiVideoModal(false)}
    />

    <div className="relative z-70 w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl bg-black p-3">
      {/* Cerrar visible siempre */}
      <button
        onClick={() => setShowAddiVideoModal(false)}
        className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 text-gray-700 hover:bg-white"
        aria-label="Cerrar"
      >
        <X size={18} />
      </button>

      <div className="flex h-full w-full flex-col items-center justify-center">
        <video
          src="/movies/addi.mp4"
          controls
          autoPlay
          playsInline
          className="w-full max-h-[80vh] rounded-md object-contain"
        >
          Tu navegador no soporta el video.
        </video>

        <p className="mt-2 text-center text-xs text-white/80">
          Si no se reproduce, cierra y vuelve a abrir el video.
        </p>
      </div>
    </div>
  </div>
)}


      {/* ===== MODAL BANCO DE BOGOTÁ ===== */}
      {showBancoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Cerrar"
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowBancoModal(false)}
          />
          <div className="animate-fadeIn relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowBancoModal(false)}
              className="absolute top-3 right-3 rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="mb-5 text-center">
              <Landmark size={36} className="mx-auto mb-2 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Crédito Banco de Bogotá
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Conoce los requisitos para acceder al crédito:
              </p>
            </div>

            <ol className="mb-6 list-inside list-decimal space-y-3 text-gray-700">
              <li>
                Ser mayor de edad y tener documento de identidad colombiano.
              </li>
               <li>Celular activo y un correo electrónico válido.</li>
              <li>No tener reportes negativos en centrales de riesgo.</li>
               <li>
               Tener el valor total del financiamiento
              </li>
            </ol>

            <button
              onClick={() => (window.location.href = BANCO_BOGOTA_URL)}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
            >
              Entendí la información y deseo continuar
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Serás redirigido al portal oficial del Banco de Bogotá.
            </p>
          </div>
        </div>
      )}

     {/* ===== MODAL PAGO DIRECTO ===== */}
{showDirectModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button
      aria-label="Cerrar"
      className="absolute inset-0 bg-black/50"
      onClick={() => {
        setShowDirectModal(false);
        setConfirmDirect(false);
      }}
    />
    <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <button
        onClick={() => {
          setShowDirectModal(false);
          setConfirmDirect(false);
        }}
        className="absolute top-3 right-3 rounded p-1 text-gray-500 hover:bg-gray-100"
        aria-label="Cerrar"
      >
        <X size={20} />
      </button>

      {!confirmDirect ? (
        <>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Pago directo mediante transferencia con descuento
          </h2>
          
          <p className="text-lg font-semibold text-green-700">
            Total con descuento:{" "}
            {directDiscountTotal.toLocaleString("es-CO", {
              style: "currency",
              currency,
            })}
          </p>

          <div className="mt-4 mb-3 border-t pt-3 text-gray-700">
            <p>
              Antes de continuar, asegúrate de que ya:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
              <li>Leíste las <strong>especificaciones del producto</strong>.</li>
              <li>Revisaste el <strong>precio final</strong> y el descuento aplicado.</li>
              <li>Estás <strong>100% seguro</strong> de realizar la compra.</li>
            </ul>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Este canal de WhatsApp es <strong>solo para pagos confirmados</strong>. Si aún tienes dudas o preguntas, revisa la información del producto antes de continuar.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setConfirmDirect(true)}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Sí, ya verifiqué todo y quiero comprar
            </button>
            <button
              onClick={() => {
                setShowDirectModal(false);
                setConfirmDirect(false);
              }}
              className="flex-1 rounded-lg border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Confirmar pago directo
          </h2>
          <p className="mb-4 text-gray-700">
            Serás redirigido al WhatsApp para coordinar el pago
            con un asesor. Este paso es exclusivo para personas que{" "}
            <strong>ya revisaron toda la información</strong> y{" "}
            <strong>desean concretar su compra.</strong>
          </p>

          <Link
            href={directWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <MessageCircle size={20} className="mr-2" />
            Continuar a WhatsApp
          </Link>
         
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
};
