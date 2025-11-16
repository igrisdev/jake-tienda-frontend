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
      <div className="mx-auto w-full max-w-7xl rounded-xs px-4 py-10 text-center">
        <span className="text-sm font-medium text-white sm:text-lg block mb-2">
          {name.length > 0 ? name : "Sin Categoría"}
        </span>
        <h1 className="text-2xl font-bold text-white sm:text-6xl uppercase">
          {collection.length > 0 ? collection : "Sin Colección"}
        </h1>
      </div>
    </section>
  );
};
