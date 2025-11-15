"use client";

import { useGetParams } from "@/hooks/useGetParams";

export const Header = () => {
  const { params: name } = useGetParams({
    name: "title",
  });

  const { params: collection } = useGetParams({
    name: "collection",
  });

  return (
    <section className="bg-linear-to-r from-blue-800 to-blue-500">
      <div className="mx-auto w-full max-w-7xl rounded-xs p-4 px-4 pt-16 pb-3">
        <span className="h-4 text-sm font-medium text-white sm:text-lg">
          {name.length > 0 ? name : "Sin Categoría"}
        </span>
        <h1 className="h-12 text-2xl font-medium text-white sm:text-5xl">
          {collection.length > 0 ? collection : "Sin Colección"}
        </h1>
      </div>
    </section>
  );
};
