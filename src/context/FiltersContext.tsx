"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Filters {
  brands: string[];
  categories: string[];
  priceRange: { min: number; max: number };
}

interface FiltersContextType {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const defaultFilters: Filters = {
  brands: [],
  categories: [],
  priceRange: { min: 0, max: 0 },
};

const FiltersContext = createContext<FiltersContextType>({
  filters: defaultFilters,
  setFilters: () => {},
});

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
