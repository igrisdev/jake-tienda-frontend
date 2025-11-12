"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface AvailableFilters {
  brands: string[];
  categories: string[];
  types: string[];
  priceRange: { min: number; max: number };
}

interface FiltersContextType {
  availableFilters: AvailableFilters;
  setAvailableFilters: (filters: AvailableFilters) => void;
}

const defaultFilters: AvailableFilters = {
  brands: [],
  categories: [],
  types: [],
  priceRange: { min: 0, max: 0 },
};

const FiltersContext = createContext<FiltersContextType>({
  availableFilters: defaultFilters,
  setAvailableFilters: () => {},
});

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [availableFilters, setAvailableFilters] =
    useState<AvailableFilters>(defaultFilters);

  return (
    <FiltersContext.Provider value={{ availableFilters, setAvailableFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
