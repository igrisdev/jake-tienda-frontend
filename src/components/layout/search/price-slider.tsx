"use client";

import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import { useFilters } from "@/context/FiltersContext";
import { useRouter, useSearchParams } from "next/navigation";

const STEP = 10;

export default function PriceSlider() {
  const { filters } = useFilters();
  const router = useRouter();
  const searchParams = useSearchParams();

  const minSafe = filters.priceRange.min ?? 0;
  const maxSafe =
    filters.priceRange.max > filters.priceRange.min
      ? filters.priceRange.max
      : filters.priceRange.min + 100;

  const [values, setValues] = useState<number[]>([minSafe, maxSafe]);

  // ✅ Solo actualiza cuando realmente cambian los filtros (min/max)
  useEffect(() => {
    if (
      filters.priceRange.min !== values[0] ||
      filters.priceRange.max !== values[1]
    ) {
      const newMin = filters.priceRange.min ?? 0;
      const newMax =
        filters.priceRange.max > filters.priceRange.min
          ? filters.priceRange.max
          : newMin + 100;
      setValues([newMin, newMax]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.priceRange.min, filters.priceRange.max]);

  const handleFinalChange = (newValues: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("price_min", newValues[0].toString());
    params.set("price_max", newValues[1].toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mt-4">
      <h4 className="mb-1 text-sm font-medium">Rango de precio</h4>
      <div className="flex flex-col items-center px-2 py-4">
        <Range
          values={values}
          step={STEP}
          min={minSafe}
          max={maxSafe}
          onChange={(vals) => setValues(vals)}
          onFinalChange={handleFinalChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                height: "6px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values,
                  colors: ["#ccc", "#16a34a", "#ccc"],
                  min: minSafe,
                  max: maxSafe,
                }),
              }}
              className="cursor-pointer"
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => {
            const { key, ...thumbProps } = props;
            return (
              <div
                key={key}
                {...thumbProps}
                style={{
                  height: "18px",
                  width: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#16a34a",
                  boxShadow: "0 0 0 2px #333",
                }}
              />
            );
          }}
        />
        <div className="mt-3 flex w-full justify-between text-xs text-gray-700">
          <span>${values[0]}</span>
          <span>${values[1]}</span>
        </div>
      </div>
    </div>
  );
}
