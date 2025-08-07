"use client";

import Image from "next/image";
import Link from "next/link";
import { RefreshCw, Search } from "lucide-react";
import { useSearchProducts } from "@/hooks/use-search-products";
import { useEffect, useRef } from "react";

export const SearchProducts = () => {
  const {
    search,
    handleChange,
    handleKeyDown,
    loading,
    isView,
    productsSearch,
    pathname,
    searchAttempted,
    selectedProductIndex,
  } = useSearchProducts();

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (selectedProductIndex !== -1 && listRef.current) {
      const selectedItem = listRef.current.children[
        selectedProductIndex
      ] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedProductIndex]);

  const renderProductItem = (product: any, index: number) => {
    const isSelected = index === selectedProductIndex;
    const isActive = pathname.includes(product.slug);

    let itemClass = "";
    if (isSelected) {
      itemClass = "bg-blue-200";
    } else if (isActive) {
      itemClass = "bg-green-200";
    } else {
      itemClass = "hover:bg-blue-100";
    }

    const brand = product.brand || "Sin marca";
    const name = product.name || "Sin nombre";
    const image = product.image || "/not-found.png";
    const categories =
      product.categories?.length > 0
        ? product.categories.join(" · ")
        : "Sin categoría";

    return (
      <li key={product.id} className={itemClass}>
        <Link
          href={`/view-product/${product.slug}`}
          className="flex items-center gap-2 rounded-xs border border-gray-300 p-2"
        >
          <Image src={image} alt="logo" width={50} height={50} />

          <div className="text-sm">
            <p className="font-medium">{name}</p>
            <p className="text-gray-500">
              {categories} · {brand}
            </p>
          </div>
        </Link>
      </li>
    );
  };

  const renderDropdown = () => {
    if (!isView) return null;

    return (
      <ul
        ref={listRef} // Se añade la ref al ul
        className="absolute top-[121%] z-10 hidden max-h-96 w-full flex-col gap-2 overflow-y-auto rounded-sm bg-white p-2 text-black shadow-lg group-focus-within:flex sm:top-[100%]"
      >
        {loading ? (
          <div className="bg-blue-200 p-2 text-center">Buscando...</div>
        ) : productsSearch.length > 0 ? (
          productsSearch.map((product, index) =>
            renderProductItem(product, index),
          )
        ) : searchAttempted ? (
          <div className="bg-blue-200 p-2 text-center">
            No se encontraron resultados
          </div>
        ) : (
          <div className="bg-blue-200 p-2 text-center">Buscando...</div>
        )}
      </ul>
    );
  };

  return (
    <section className="relative">
      <div className="group">
        <div className="relative flex w-full items-center">
          <input
            type="text"
            className="w-full rounded-full border border-gray-400 px-4 py-2 focus:border-blue-50"
            placeholder="Buscar..."
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Search className="absolute right-4" />
          {loading && <RefreshCw className="absolute right-14 animate-spin" />}
        </div>

        {renderDropdown()}
      </div>
    </section>
  );
};
