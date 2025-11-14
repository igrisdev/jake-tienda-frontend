"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { useSearchProducts } from "@/hooks/use-search-products";
import { RefreshCw, Search } from "lucide-react";
import { createUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const SearchProducts = () => {
  const router = useRouter();
  const {
    handleChange,
    loading,
    isView,
    productsSearch,
    searchAttempted,
    pathname,
    setFocus,
    search,
  } = useSearchProducts();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setFocus(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [setFocus]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFocus(false);

    inputRef.current?.blur();

    const form = e.currentTarget;
    const q = ((new FormData(form).get("q") as string) || "").trim();

    const newParams = new URLSearchParams();
    if (q) newParams.set("q", q);

    router.push(createUrl("/search", newParams));
  }

  const renderProductItem = (product: any) => {
    const isActive = pathname?.includes(product.handle);
    const itemClass = isActive ? "bg-green-300" : "hover:bg-blue-100";

    return (
      <li key={product.id} className={itemClass}>
        <Link
          href={`/product/${product.handle}`}
          className="flex items-center gap-2 rounded-xs border border-gray-300 p-2"
        >
          {/* <Image
            src={product?.featuredImage?.url ?? "/not-found.png"}
            alt="logo"
            width={50}
            height={50}
            unoptimized
          /> */}
          <img
            src={product?.featuredImage?.url ?? "/not-found.png"}
            alt="Logo"
            className="size-[50]"
          />
          <div className="text-sm">
            <p className="font-medium">{product.title}</p>
          </div>
        </Link>
      </li>
    );
  };

  const renderDropdown = () => {
    if (!isView) return null;
    return (
      <ul className="absolute top-[121%] z-10 flex max-h-90 w-full flex-col gap-2 overflow-y-auto rounded-sm bg-blue-50 p-2 text-black shadow-lg sm:top-[100%]">
        {loading ? (
          <div className="bg-blue-200 p-2 text-center">Buscando...</div>
        ) : productsSearch.length > 0 ? (
          productsSearch.map(renderProductItem)
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
    <section className="relative" ref={wrapperRef}>
      <div className="group">
        <form onSubmit={onSubmit} className="relative flex w-full items-center">
          <input
            ref={inputRef}
            type="text"
            name="q"
            placeholder="Buscar productos..."
            autoComplete="off"
            value={search}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            className="w-full rounded-full border border-gray-400 px-4 py-2 focus:border-blue-50"
          />
          {loading ? (
            <RefreshCw className="absolute right-4 animate-spin" />
          ) : (
            <Search className="absolute right-4" />
          )}
        </form>

        {renderDropdown()}
      </div>
    </section>
  );
};
