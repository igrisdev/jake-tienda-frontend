import FilterList from "@/components/layout/search/filter";
import { sorting } from "@/lib/constants";
import { FiltersProvider } from "@/context/FiltersContext";
import { FiltersSidebar } from "@/components/layout/search/filters-sidebar";
import { ProductSearchProvider } from "@/context/ProductSearchContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar productos | Jake Tienda Electrónica",
  description:
    "Encuentra parlantes, controladoras DJ, consolas, subwoofers y tecnología de sonido profesional. Filtra y ordena productos con envío a toda Colombia.",
  alternates: {
    canonical: "/search",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Buscar productos | Jake Tienda Electrónica",
    description:
      "Explora y filtra productos de audio profesional, DJ y tecnología. Envíos y financiación en Colombia.",
    type: "website",
    url: "/search",
    siteName: "Jake Tienda Electrónica",
    locale: "es_CO",
    images: [
      {
        url: "/favicong.svg",
        width: 1200,
        height: 630,
        alt: "Jake Tienda Electrónica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buscar productos | Jake Tienda Electrónica",
    description:
      "Encuentra y filtra productos de sonido profesional, DJ y tecnología.",
    images: ["/favicong.svg"],
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FiltersProvider>
      <ProductSearchProvider>
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-6 pb-4 text-black md:flex-row">
          <div className="order-first flex-none md:w-max">
            <FiltersSidebar />
          </div>
          <div className="order-last min-h-screen w-full md:order-none">
            {children}
          </div>
          <div className="order-none flex-none md:order-last md:w-max">
            <FilterList list={sorting} title="Ordenar por" />
          </div>
        </div>
      </ProductSearchProvider>
    </FiltersProvider>
  );
}
