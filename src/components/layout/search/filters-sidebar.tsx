"use client";

import { useState, useEffect, ReactNode } from "react";
import { useFilters } from "@/context/FiltersContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

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

type FilterSectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
}: FilterSectionProps) => (
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
    categories: false,
    price: false,
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

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedTypes([]);
    setMinPrice("");
    setMaxPrice("");
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

  return (
    <div className="filters flex w-full flex-col gap-6 md:w-70">
      <div className="space-y-0">
        <FilterSection
          title="Marca"
          isOpen={openSections.brands}
          onToggle={() => toggleSection("brands")}
        >
          <ul className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 max-h-48 space-y-2 overflow-y-auto pr-2">
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
                  className="ml-3 cursor-pointer text-sm text-gray-700"
                >
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        <FilterSection
          title="Categorías"
          isOpen={openSections.types}
          onToggle={() => toggleSection("types")}
        >
          <ul className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 max-h-48 space-y-2 overflow-y-auto pr-2">
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
                  className="ml-3 cursor-pointer text-sm text-gray-700"
                >
                  {type}
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        <FilterSection
          title="Tipo de Producto"
          isOpen={openSections.categories}
          onToggle={() => toggleSection("categories")}
        >
          <ul className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 max-h-48 space-y-2 overflow-y-auto pr-2">
            {availableFilters.categories.sort().map((category) => (
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

        <FilterSection
          title="Precio"
          isOpen={openSections.price}
          onToggle={() => toggleSection("price")}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={`Min`}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <span>-</span>
            <input
              type="number"
              placeholder={`Max`}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </FilterSection>
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <button
          onClick={handleApplyFilters}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
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
