"use client";

import { useState } from "react";
import founderImg from "@/assets/images/Kevin.jpeg";

const STORE = {
  name: "Jake Tienda Electrónica",
  address: "Calle 6 #10-09, Centro, Popayán, Cauca",
  lat: 2.44158,
  lng: -76.60996,
  whatsapp: "573103876150",
  phoneDisplay: "(+57) 310 387 6150",
};

export default function AboutSection() {
  const [copied, setCopied] = useState<null | "address">(null);

  const googleEmbed = `https://maps.google.com/maps?q=${STORE.lat},${STORE.lng}&z=19&hl=es&output=embed`;
  const googleDirections = `https://www.google.com/maps/dir/?api=1&destination=${STORE.lat},${STORE.lng}`;
  const wazeDirections = `https://waze.com/ul?ll=${STORE.lat}%2C${STORE.lng}&navigate=yes`;
  const whatsappLink = `https://wa.me/${STORE.whatsapp}`;
  const telLink = `tel:+573103876150`;

  const handleCopy = async (text: string, type: "address") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    } catch (e) {}
  };

  return (
    <div className="flex flex-col space-y-16 pt-10 sm:pt-20">
      <div className="mx-auto max-w-7xl space-y-4 px-6 text-center lg:px-20">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Tecnología y sonido profesional en Colombia
        </h1>
        <p className="text-lg leading-relaxed text-gray-700">
          En <strong>{STORE.name}</strong> somos apasionados por el sonido
          profesional y la tecnología. Desde <strong>Popayán, Colombia</strong>,
          ayudamos a DJs, músicos, negocios e instituciones a encontrar el
          equipo perfecto:{" "}
          <strong>
            parlantes, controladoras DJ, subwoofers, consolas y más
          </strong>
          . Brindamos asesoría personalizada, productos de alta calidad y{" "}
          <strong>financiación</strong> para que nadie se quede sin sonar como
          quiere.
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col space-y-16 px-6 py-10 lg:px-20">
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="relative w-full">
            <img
              src={founderImg.src}
              alt="Fundador de jake Popayán"
              className="mask-b-from-70% mask-b-to-90% object-cover"
            />
          </div>

          <div className="flex flex-col justify-center text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-900">Kevin Medina</h2>
            <p className="mt-2 text-lg text-gray-500">Fundador</p>
            <p className="mt-4 leading-relaxed text-gray-600">
              La historia de {STORE.name} comenzó con una pasión por el sonido.
              Soñé con una tienda donde músicos, DJs y amantes de la tecnología
              encontraran no solo productos, sino confianza, asesoría y
              comunidad. Lo que empezó en Popayán hoy es referente en el sur de
              Colombia. Esta tienda fue creada pensando en ti: en tu ritmo y en
              tu necesidad de sonar mejor.
            </p>
          </div>
        </section>

        <section className="flex flex-col space-y-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Nuestra Ubicación
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 md:h-96">
              <iframe
                title={`${STORE.name} en el mapa`}
                src={googleEmbed}
                width="100%"
                height="100%"
                loading="lazy"
                className="border-0"
                aria-label="Mapa con la ubicación exacta de la tienda"
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/5 to-transparent" />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5">
              <p className="text-sm tracking-wide text-gray-500 uppercase">
                Dirección
              </p>
              <h3 className="mt-1 text-xl font-semibold text-gray-900">
                {STORE.address}
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href={googleDirections}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 hover:border-gray-300 hover:bg-gray-50 active:scale-[.98]"
                  aria-label="Cómo llegar en Google Maps"
                  title="Abrir en Google Maps"
                >
                  Google Maps
                </a>
                <a
                  href={wazeDirections}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 hover:border-gray-300 hover:bg-gray-50 active:scale-[.98]"
                  aria-label="Cómo llegar en Waze"
                  title="Abrir en Waze"
                >
                  Waze
                </a>
                <a
                  href={telLink}
                  className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 active:scale-[.98]"
                  aria-label={`Llamar a ${STORE.name}`}
                  title="Llamar ahora"
                >
                  Llamar {STORE.phoneDisplay}
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-[.98]"
                  aria-label="Escribir por WhatsApp"
                  title="WhatsApp"
                >
                  WhatsApp
                </a>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <span className="text-sm text-gray-700">
                  Calle 6 #10-09, Centro, Popayán
                </span>
                <button
                  onClick={() => handleCopy(STORE.address, "address")}
                  className="rounded-lg px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-white"
                  aria-label="Copiar dirección"
                  title="Copiar dirección"
                >
                  {copied === "address" ? "¡Copiado!" : "Copiar"}
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Consejo: si ves que el pin no cae exactamente en la puerta, usa
                “Street View” en Google Maps y deja tu marcador guardado para
                futuras visitas.
              </p>
            </div>
          </div>

          <p className="text-center text-lg text-gray-700">
            Estamos en <strong>{STORE.address}</strong>
          </p>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-black/5">
            <h3 className="mb-3 text-2xl font-bold text-gray-900">Misión</h3>
            <p className="text-gray-700">
              Ofrecer <strong>tecnología de sonido profesional</strong>{" "}
              accesible para toda Colombia, con equipos de alto rendimiento,
              asesoría honesta y múltiples métodos de pago, incluido{" "}
              <strong>crédito en línea</strong>.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-black/5">
            <h3 className="mb-3 text-2xl font-bold text-gray-900">Visión</h3>
            <p className="text-gray-700">
              Ser la <strong>tienda líder en audio profesional</strong>,
              reconocida por la calidad de nuestros productos, servicio cercano
              y una experiencia de compra impecable.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
