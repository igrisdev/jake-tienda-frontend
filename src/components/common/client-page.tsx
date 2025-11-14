"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useProductSearch } from "@/context/ProductSearchContext"; // IMPORTA EL NUEVO HOOK
import FiltersUpdater from "@/components/layout/search/filters-updater";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { getProducts } from "@/lib/shopify";
import { LoadMore } from "./load-more";
import { sorting, defaultSort } from "@/lib/constants";
import type { PageInfo, Product } from "@/lib/shopify/types";
import type { AvailableFilters } from "@/context/FiltersContext";

type Props = {
  initialFilters: AvailableFilters;
  initialProducts: Product[];
  initialPageInfo: PageInfo;
};

// Variable para rastrear si es la carga inicial o una navegación "hacia atrás"
let isInitialLoad = true;

export function SearchClientPage({
  initialFilters,
  initialProducts,
  initialPageInfo,
}: Props) {
  // Leemos y escribimos en el CONTEXTO, no en el estado local
  const { products, setProducts, pageInfo, setPageInfo } = useProductSearch();
  const searchParams = useSearchParams();

  // Efecto para inicializar el contexto o resetearlo si los filtros cambian
  useEffect(() => {
    // Si los productos iniciales son diferentes a los del contexto, es una nueva búsqueda.
    // Comparamos el ID del primer producto para evitar bucles infinitos.
    if (initialProducts[0]?.id !== products[0]?.id || isInitialLoad) {
      setProducts(initialProducts);
      setPageInfo(initialPageInfo);
      isInitialLoad = false;
    }
  }, [initialProducts, initialPageInfo, setProducts, setPageInfo, products]);

  const loadMoreProducts = useCallback(async () => {
    if (!pageInfo?.endCursor) return { products: [], pageInfo };

    const params = new URLSearchParams(searchParams.toString());
    const sort = params.get("sort") ?? "";
    const { sortKey, reverse } =
      sorting.find((item) => item.slug === sort) || defaultSort;

    const { products: newProducts, pageInfo: newPageInfo } = await getProducts({
      sortKey,
      reverse,
      query: params.get("q") || undefined,
      brands: params.getAll("brands"),
      category: params.getAll("category"),
      types: params.getAll("types"),
      priceMin: params.get("price_min")
        ? Number(params.get("price_min"))
        : undefined,
      priceMax: params.get("price_max")
        ? Number(params.get("price_max"))
        : undefined,
      after: pageInfo.endCursor,
    });

    // Actualizamos el CONTEXTO con los nuevos productos
    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setPageInfo(newPageInfo);

    return { products: newProducts, pageInfo: newPageInfo };
  }, [pageInfo, searchParams, setProducts, setPageInfo]);

  return (
    <>
      <FiltersUpdater initialFilters={initialFilters} />

      {products.length === 0 ? (
        <p className="py-4 text-center">
          No se encontraron productos con estos filtros.
        </p>
      ) : (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* El grid ahora renderiza los productos desde el contexto */}
            <ProductGridItems products={products} />
          </Grid>
          {pageInfo && (
            <LoadMore loadMoreProducts={loadMoreProducts} pageInfo={pageInfo} />
          )}
        </>
      )}
    </>
  );
}
