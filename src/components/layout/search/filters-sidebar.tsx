"use client";

import { useFilters } from "@/context/FiltersContext";
import PriceSlider from "./price-slider";

export default function FiltersSidebar() {
  const { filters } = useFilters();

  return (
    <div className="rounded-md border p-4">
      <h3 className="mb-2 font-semibold">Filtros disponibles</h3>

      <div>
        <h4 className="mb-1 text-sm font-medium">Marcas</h4>
        <ul className="ml-2">
          {filters.brands.map((brand) => (
            <li key={brand}>{brand}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="mb-1 text-sm font-medium">Categorías</h4>
        <ul className="ml-2">
          {filters.categories.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      </div>

      <PriceSlider />
    </div>
  );
}
