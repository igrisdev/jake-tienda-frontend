import AboutSection from "@/components/about-us/about-section";

const STORE = {
  name: "Jake Tienda Electrónica",
  address: "Calle 6 #10-09, Centro, Popayán, Cauca",
  lat: 2.44158,
  lng: -76.60996,
  url: "https://jaketiendaelectronica.com/about-us",
  telephone: "+57 310 387 6150",
};

function jsonLdLocalBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: STORE.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle 6 #10-09",
      addressLocality: "Popayán",
      addressRegion: "Cauca",
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: STORE.lat,
      longitude: STORE.lng,
    },
    url: STORE.url,
    telephone: STORE.telephone,
  };
}

export const metadata = {
  title: "Sobre nosotros | Jake Tienda Electrónica",
  description:
    "Conoce la historia de Jake Tienda Electrónica: expertos en audio profesional, tecnología y soluciones con financiación en Colombia. Atención personalizada y envío nacional.",
  keywords: [
    "Jake Tienda Electrónica",
    "quiénes somos",
    "tienda de sonido Popayán",
    "tecnología de audio en Colombia",
    "audio profesional",
    "controladoras DJ Colombia",
    "historia Jake Tienda",
    "tecnología financiada",
    "parlantes Popayán",
    "equipo de sonido Colombia",
  ],
  openGraph: {
    title: "Sobre Jake Tienda Electrónica",
    description:
      "Especialistas en tecnología de sonido profesional. Te contamos nuestra historia, visión y cómo ayudamos a nuestros clientes en Colombia.",
    url: STORE.url,
    siteName: "Jake Tienda Electrónica",
    images: [
      {
        url: "/favicon.svg",
        width: 1200,
        height: 630,
        alt: "Jake Tienda Electrónica",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  alternates: {
    canonical: STORE.url,
  },
  jsonLd: jsonLdLocalBusiness(),
};

export default function AboutUsPage() {
  return <AboutSection />;
}
