"use client";

import { useEffect } from "react";
import { useFilters, Filters } from "@/context/FiltersContext";

export default function FiltersUpdater({ filters }: { filters: Filters }) {
  const { setFilters } = useFilters();

  useEffect(() => {
    setFilters(filters);
  }, [filters, setFilters]);

  return null;
}
