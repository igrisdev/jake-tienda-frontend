"use client";

import { useEffect } from "react";
import { useFilters, AvailableFilters } from "@/context/FiltersContext";

export default function FiltersUpdater({
  initialFilters,
}: {
  initialFilters: AvailableFilters;
}) {
  const { setAvailableFilters } = useFilters();

  useEffect(() => {
    setAvailableFilters(initialFilters);
  }, [initialFilters, setAvailableFilters]);

  return null;
}
