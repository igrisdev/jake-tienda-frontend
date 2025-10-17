"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Landmark, MessageCircle, Info, X } from "lucide-react";

import { Product } from "@/lib/shopify/types";
import Price from "../price";
import { AddToCart } from "../cart/add-to-cart";

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
    `Hola, quiero financiar mi compra del producto "${product.title}" con Addi.`,
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
        <p className="text-2xl font-semibold text-gray-800">
          {directDiscountTotal.toLocaleString("es-CO", {
            style: "currency",
            currency,
          })}
        </p>
        <p className="text-sm text-green-700">
          Descuento del 4% en pago directo
        </p>
        <p className="text-sm text-gray-600">
          Transferencia bancaria <span>(Nequi, Daviplata, etc)</span>
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

      {/* ===== MODAL ADDI ===== */}
      {showAddiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Cerrar"
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddiModal(false)}
          />
          <div className="animate-fadeIn relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowAddiModal(false)}
              className="absolute top-3 right-3 rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Financia tu compra con Addi
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Para poder aplicar, asegúrate de cumplir con los siguientes
                requisitos:
              </p>
            </div>

            <ol className="mb-6 list-inside list-decimal space-y-3 text-gray-700">
              <li>
                Ser mayor de edad y tener documento de identidad colombiano.
              </li>
              <li>
                Tener un celular con acceso a WhatsApp para la verificación.
              </li>
              <li>Tener direccion de correo electrónico válida.</li>
              <li>
                La compra debe tener un valor minimo de $50.000 pesos
                colombianos.
              </li>
            </ol>

            <button
              onClick={() => (window.location.href = addiWhatsAppHref)}
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
              <li>Contar con ingresos estables y comprobables.</li>
              <li>No tener reportes negativos en centrales de riesgo.</li>
              <li>Presentar extractos bancarios o desprendibles de pago.</li>
              <li>
                Contar con una cuenta activa en el Banco de Bogotá o estar
                dispuesto a abrir una.
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
                  Pago directo con descuento del 4%
                </h2>
                <p className="mb-3 text-gray-700">
                  Al pagar directamente por{" "}
                  <strong>transferencia bancaria</strong> obtienes un descuento
                  del <strong>4%</strong>.
                </p>
                <p className="text-lg font-semibold text-green-700">
                  Total con descuento:{" "}
                  {directDiscountTotal.toLocaleString("es-CO", {
                    style: "currency",
                    currency,
                  })}
                </p>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => setConfirmDirect(true)}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Sí, deseo continuar
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
                  Serás redirigido a nuestro WhatsApp para coordinar el pago con
                  un asesor.
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
