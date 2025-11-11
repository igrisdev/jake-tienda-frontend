"use client";

import { useFilters } from "@/context/FiltersContext";
import { FilterItem } from "./filter-item";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FiltersSidebar() {
  const { filters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClearFilters = () => {
    // Mantenemos la búsqueda (q) y el orden (sort), pero limpiamos los filtros
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brands");
    params.delete("category");
    params.delete("price_min");
    params.delete("price_max");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Comprobamos si hay algún filtro activo
  const hasActiveFilters =
    searchParams.has("brands") || searchParams.has("category");
  return (
    <div className="w-full rounded-md border p-4 md:w-64">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      {filters.brands.length > 0 && (
        <div>
          <h4 className="mb-1 font-medium">Marcas</h4>
          <ul className="ml-2">
            {filters.brands.map((brand) => (
              <FilterItem key={brand} type="brand" value={brand} />
            ))}
          </ul>
        </div>
      )}

      {filters.categories.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-1 font-medium">Categorías</h4>
          <ul className="ml-2">
            {filters.categories.map((cat) => (
              <FilterItem key={cat} type="category" value={cat} />
            ))}
          </ul>
        </div>
      )}

      {/* <PriceSlider />  */}
    </div>
  );
}
