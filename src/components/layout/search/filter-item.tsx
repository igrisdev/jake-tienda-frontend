"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

type FilterItemProps = {
  type: "brand" | "category"; // 'brand' o 'category'
  value: string;
};

export function FilterItem({ type, value }: FilterItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const active =
    searchParams.get(type === "brand" ? "brands" : "category") === value;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      // Si el filtro ya está activo, lo quitamos para "deseleccionar"
      if (params.get(name) === value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      // Reseteamos la paginación al cambiar filtros
      params.delete("page");
      params.delete("after");
      params.delete("before");
      return params.toString();
    },
    [searchParams],
  );

  const handleClick = () => {
    const newQuery = createQueryString(
      type === "brand" ? "brands" : "category",
      value,
    );
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  };

  return (
    <li
      key={value}
      onClick={handleClick}
      className={`cursor-pointer py-1 ${active ? "font-bold" : "hover:underline"}`}
    >
      <input type="checkbox" checked={active} readOnly className="mr-2" />
      {value}
    </li>
  );
}
