"use client";

import { useState, useEffect, ReactNode } from "react";
import { useFilters } from "@/context/FiltersContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useGetParams } from "@/hooks/useGetParams";

const AccordionIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    ></path>
  </svg>
);

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) => (
  <div className="border-b border-gray-200 py-4">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between text-left"
    >
      <h3 className="font-bold tracking-wider text-gray-800 uppercase">
        {title}
      </h3>
      <AccordionIcon isOpen={isOpen} />
    </button>
    {isOpen && <div className="mt-4">{children}</div>}
  </div>
);

const ActiveFilterPill = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <div className="animate-in fade-in-50 flex items-center justify-between gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
    <span>{label}</span>
    <button onClick={onRemove} className="text-gray-500 hover:text-black">
      <XMarkIcon className="h-4 w-4" />
    </button>
  </div>
);

export function FiltersSidebar() {
  const { availableFilters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [openSections, setOpenSections] = useState({
    brands: true,
    types: true,
    categories: true,
    price: true,
  });

  const { params: whatCollection } = useGetParams({
    name: "title",
  });

  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brands"));
    setSelectedCategories(searchParams.getAll("category"));
    setSelectedTypes(searchParams.getAll("types"));
    setMinPrice(searchParams.get("price_min") || "");
    setMaxPrice(searchParams.get("price_max") || "");
  }, [searchParams]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (
    key: "brands" | "categories" | "types",
    value: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramKey = key === "categories" ? "category" : key;
    const currentValues = params.getAll(paramKey);

    if (currentValues.includes(value)) {
      // Si ya está, lo eliminamos (desmarcar)
      const newValues = currentValues.filter((v) => v !== value);
      params.delete(paramKey);
      newValues.forEach((v) => params.append(paramKey, v));
    } else {
      params.append(paramKey, value);
    }

    // Siempre reseteamos la paginación al cambiar un filtro
    params.delete("page");
    params.delete("after");
    params.delete("before");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRemoveFilter = (
    key: "brands" | "categories" | "types",
    value: string,
  ) => {
    handleCheckboxChange(key, value);
  };

  const handleClearFilters = () => {
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

  const hasActiveFilters =
    searchParams.has("brands") ||
    searchParams.has("category") ||
    searchParams.has("types") ||
    searchParams.has("price_min") ||
    searchParams.has("price_max");

  return (
    <div className="flex w-60 flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          FILTROS
        </h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm font-medium tracking-wider text-gray-500 uppercase hover:text-black"
          >
            Limpiar Todo
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchParams.getAll("brands").map((brand) => (
            <ActiveFilterPill
              key={brand}
              label={brand}
              onRemove={() => handleRemoveFilter("brands", brand)}
            />
          ))}
          {searchParams.getAll("category").map((cat) => (
            <ActiveFilterPill
              key={cat}
              label={cat}
              onRemove={() => handleRemoveFilter("categories", cat)}
            />
          ))}
          {searchParams.getAll("types").map((type) => (
            <ActiveFilterPill
              key={type}
              label={type}
              onRemove={() => handleRemoveFilter("types", type)}
            />
          ))}
        </div>
      )}

      <div className="space-y-0">
        {whatCollection != 'Categoría' && whatCollection != 'Subcategoría' && (
          <FilterSection
            title="Categorías"
            isOpen={openSections.types}
            onToggle={() => toggleSection("types")}
          >
            <ul className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 max-h-48 space-y-2 overflow-y-auto pr-2">
              {availableFilters.types.length < 1 && (
                <li className="flex items-center text-xs">
                  No hay categorías disponibles
                </li>
              )}
              {availableFilters.types.map((type) => (
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
                    className="ml-3 cursor-pointer text-sm text-gray-700"
                  >
                    {type}
                  </label>
                </li>
              ))}
            </ul>
          </FilterSection>
        )}



        {whatCollection != 'Marcas' && (
          <FilterSection
            title="Marca"
            isOpen={openSections.brands}
            onToggle={() => toggleSection("brands")}
          >
            <ul className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 max-h-48 space-y-2 overflow-y-auto pr-2">

              {availableFilters.brands.length < 1 && (
                <li className="flex items-center text-xs">
                  No hay marcas disponibles
                </li>
              )}
              {availableFilters.brands.map((brand) => (
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
                    className="ml-3 cursor-pointer text-sm text-gray-700"
                  >
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          </FilterSection>
        )}



        <FilterSection
          title="Tipo de Producto"
          isOpen={openSections.categories}
          onToggle={() => toggleSection("categories")}
        >
          <ul className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 max-h-48 space-y-2 overflow-y-auto pr-2">
            {availableFilters.categories.length < 1 && (
              <li className="flex items-center text-xs">
                No hay tipos de productos disponibles
              </li>
            )}
            {availableFilters.categories.map((category) => (
              <li key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  onChange={() => handleCheckboxChange("categories", category)}
                  checked={selectedCategories.includes(category)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-3 cursor-pointer text-sm text-gray-700"
                >
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>
      </div>
    </div>
  );
}
