// components/FiltersSidebar.tsx

"use client";

import { useState, useEffect } from "react";
import { useFilters } from "@/context/FiltersContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

// Un pequeño componente para el ícono del acordeón para mantener el JSX limpio
const AccordionIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    ></path>
  </svg>
);

export function FiltersSidebar() {
  // 1. OBTENER DATOS Y HOOKS
  const { availableFilters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 2. ESTADO LOCAL
  // Estado para filtros pendientes (antes de aplicar)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // NUEVO: Estado para controlar qué secciones del acordeón están abiertas
  const [openSections, setOpenSections] = useState({
    brands: true,
    types: true,
    categories: true,
    price: true,
  });

  // 3. SINCRONIZAR ESTADO CON URL (al cargar)
  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brands"));
    setSelectedCategories(searchParams.getAll("category"));
    setSelectedTypes(searchParams.getAll("types"));
    setMinPrice(searchParams.get("price_min") || "");
    setMaxPrice(searchParams.get("price_max") || "");
  }, [searchParams]);

  // 4. MANEJADORES DE EVENTOS
  /**
   * NUEVO: Cambia el estado de visibilidad de una sección del acordeón.
   */
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /**
   * Actualiza el estado local cuando un checkbox cambia.
   */
  const handleCheckboxChange = (
    key: "brands" | "categories" | "types",
    value: string,
  ) => {
    const setters = {
      brands: setSelectedBrands,
      categories: setSelectedCategories,
      types: setSelectedTypes,
    };
    setters[key]((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  /**
   * Construye la URL y navega al hacer clic en "Aplicar Filtros".
   */
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brands");
    params.delete("category");
    params.delete("types");

    selectedBrands.forEach((brand) => params.append("brands", brand));
    selectedCategories.forEach((cat) => params.append("category", cat));
    selectedTypes.forEach((type) => params.append("types", type));

    if (minPrice) params.set("price_min", minPrice);
    else params.delete("price_min");
    if (maxPrice) params.set("price_max", maxPrice);
    else params.delete("price_max");

    params.delete("page");
    params.delete("after");
    params.delete("before");
    router.push(`${pathname}?${params.toString()}`);
  };

  /**
   * ACTUALIZADO: Limpia la URL y el estado local para un reseteo visual instantáneo.
   */
  const handleClearFilters = () => {
    // 1. Limpiar el estado local para que la UI se actualice al instante
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedTypes([]);
    setMinPrice("");
    setMaxPrice("");

    // 2. Crear nueva URL sin los filtros
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brands");
    params.delete("category");
    params.delete("types");
    params.delete("price_min");
    params.delete("price_max");
    params.delete("page");
    params.delete("after");
    params.delete("before");
    router.push(`${pathname}?${params.toString()}`);
  };

  // 5. RENDERIZADO DEL COMPONENTE
  return (
    <div className="filters flex w-full flex-col gap-6 md:w-70">
      {/* --- Acordeón de Filtros --- */}
      <div className="space-y-4">
        {/* Filtro MARCA */}
        <div>
          <button
            onClick={() => toggleSection("brands")}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold">Marca</h3>
            <AccordionIcon isOpen={openSections.brands} />
          </button>
          {openSections.brands && (
            <ul className="mt-2 space-y-1 pl-2">
              {availableFilters.brands.sort().map((brand) => (
                <li key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    onChange={() => handleCheckboxChange("brands", brand)}
                    checked={selectedBrands.includes(brand)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="ml-3 cursor-pointer text-sm text-gray-600"
                  >
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filtro TIPO DE PRODUCTO */}
        <div>
          <button
            onClick={() => toggleSection("types")}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold">Tipo de Producto</h3>
            <AccordionIcon isOpen={openSections.types} />
          </button>
          {openSections.types && (
            <ul className="mt-2 space-y-1 pl-2">
              {availableFilters.types.sort().map((type) => (
                <li key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    onChange={() => handleCheckboxChange("types", type)}
                    checked={selectedTypes.includes(type)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="ml-3 cursor-pointer text-sm text-gray-600"
                  >
                    {type}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filtro CATEGORÍAS */}
        <div>
          <button
            onClick={() => toggleSection("categories")}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold">Categorías</h3>
            <AccordionIcon isOpen={openSections.categories} />
          </button>
          {openSections.categories && (
            <ul className="mt-2 space-y-1 pl-2">
              {availableFilters.categories.sort().map((category) => (
                <li key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    onChange={() =>
                      handleCheckboxChange("categories", category)
                    }
                    checked={selectedCategories.includes(category)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="ml-3 cursor-pointer text-sm text-gray-600"
                  >
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filtro PRECIO */}
        <div>
          <button
            onClick={() => toggleSection("price")}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold">Precio</h3>
            <AccordionIcon isOpen={openSections.price} />
          </button>
          {openSections.price && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                placeholder={`Min (${availableFilters.priceRange.min})`}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <span>-</span>
              <input
                type="number"
                placeholder={`Max (${availableFilters.priceRange.max})`}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* --- Controles Principales (AHORA AL FINAL) --- */}
      <div className="flex flex-col gap-2 border-t pt-4">
        <button
          onClick={handleApplyFilters}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={handleClearFilters}
          className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-300"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}
