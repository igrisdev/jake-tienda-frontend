"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useProductSearch } from "@/context/ProductSearchContext";
import FiltersUpdater from "@/components/layout/search/filters-updater";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { getProducts } from "@/lib/shopify";
import { LoadMore } from "./load-more";
import { sorting, defaultSort } from "@/lib/constants";
import type { PageInfo, Product } from "@/lib/shopify/types";
import type { AvailableFilters } from "@/context/FiltersContext";
import { MobileFilters } from "./mobile-filters";

type Props = {
  initialProducts: Product[];
  initialPageInfo: PageInfo;
  initialFilters: AvailableFilters;
};

export function SearchClientPage({
  initialProducts,
  initialPageInfo,
  initialFilters,
}: Props) {
  const { products, setProducts, pageInfo, setPageInfo } = useProductSearch();
  const searchParams = useSearchParams();
  const currentSearchParamsString = searchParams.toString();
  const query = searchParams.get("q");

  useEffect(() => {
    const savedSearchParamsString = sessionStorage.getItem("lastSearchParams");

    if (
      currentSearchParamsString !== savedSearchParamsString ||
      products.length === 0
    ) {
      setProducts(initialProducts);
      setPageInfo(initialPageInfo);
      sessionStorage.setItem("lastSearchParams", currentSearchParamsString);
    }
  }, [
    currentSearchParamsString,
    initialProducts,
    initialPageInfo,
    setProducts,
    setPageInfo,
    products.length,
  ]);

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

    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setPageInfo(newPageInfo);

    return { products: newProducts, pageInfo: newPageInfo };
  }, [pageInfo, searchParams, setProducts, setPageInfo]);

  return (
    <>
      <FiltersUpdater initialFilters={initialFilters} />

      {query && (
        <h2 className="mb-4 text-xl font-semibold">
          Resultados para: <span className="font-bold">{query}</span>
        </h2>
      )}

      {products.length === 0 ? (
        <p className="py-4 text-center">
          {query
            ? `No se encontraron productos para "${query}".`
            : "No se encontraron productos con los filtros seleccionados."}
        </p>
      ) : (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
