"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useProductSearch } from "@/context/ProductSearchContext";
import FiltersUpdater from "@/components/layout/search/filters-updater";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { getCollectionProducts } from "@/lib/shopify";
import { LoadMore } from "@/components/common/load-more";
import { sorting, defaultSort } from "@/lib/constants";
import type { PageInfo, Product } from "@/lib/shopify/types";
import { MobileFilters } from "@/components/common/mobile-filters";
import { useGetParams } from "@/hooks/useGetParams";

type Props = {
  initialProducts: Product[];
  initialPageInfo: PageInfo;
  collection: string;
};

export function CollectionClientPage({
  initialProducts,
  initialPageInfo,
  collection,
}: Props) {
  const { products, setProducts, pageInfo, setPageInfo } = useProductSearch();
  const searchParams = useSearchParams();

  // Keep track of ALL loaded products for client-side filtering
  const [allLoadedProducts, setAllLoadedProducts] =
    useState<Product[]>(initialProducts);

  // Initialize context on mount or when initial props change
  useEffect(() => {
    setProducts(initialProducts);
    setAllLoadedProducts(initialProducts);
    setPageInfo(initialPageInfo);
  }, [initialProducts, initialPageInfo, setProducts, setPageInfo]);

  // Derive available filters from ALL loaded products
  const availableFilters = useMemo(() => {
    const brands = new Set<string>();
    const categories = new Set<string>();
    const types = new Set<string>();
    const prices: number[] = [];

    allLoadedProducts.forEach((product) => {
      if (!product) return;

      if (product.vendor) brands.add(product.vendor);
      if (product.productType) types.add(product.productType);

      if (product.tags) {
        product.tags.forEach((tag) => categories.add(tag));
      }

      if (product.priceRange?.maxVariantPrice?.amount) {
        const price = parseFloat(product.priceRange.maxVariantPrice.amount);
        if (!isNaN(price)) prices.push(price);
      }
    });

    return {
      brands: Array.from(brands),
      categories: Array.from(categories),
      types: Array.from(types),
      priceRange: {
        min: prices.length ? Math.min(...prices) : 0,
        max: prices.length ? Math.max(...prices) : 0,
      },
    };
  }, [allLoadedProducts]);

  // Filter products based on current search params
  const displayedProducts = useMemo(() => {
    const selectedBrands = searchParams.getAll("brands");
    const selectedCategories = searchParams.getAll("category");
    const selectedTypes = searchParams.getAll("types");
    const priceMin = searchParams.get("price_min")
      ? Number(searchParams.get("price_min"))
      : undefined;
    const priceMax = searchParams.get("price_max")
      ? Number(searchParams.get("price_max"))
      : undefined;

    return allLoadedProducts.filter((product) => {
      if (!product) return false;

      // Filter by Brand
      if (
        selectedBrands.length > 0 &&
        !selectedBrands.includes(product.vendor)
      ) {
        return false;
      }

      // Filter by Type
      if (
        selectedTypes.length > 0 &&
        !selectedTypes.includes(product.productType)
      ) {
        return false;
      }

      // Filter by Category (Tags)
      if (selectedCategories.length > 0) {
        const hasCategory = product.tags?.some((tag) =>
          selectedCategories.includes(tag),
        );
        if (!hasCategory) return false;
      }

      // Filter by Price
      if (product.priceRange?.maxVariantPrice?.amount) {
        const price = parseFloat(product.priceRange.maxVariantPrice.amount);
        if (priceMin !== undefined && price < priceMin) return false;
        if (priceMax !== undefined && price > priceMax) return false;
      }

      return true;
    });
  }, [allLoadedProducts, searchParams]);

  // Update context products whenever displayedProducts changes
  useEffect(() => {
    setProducts(displayedProducts);
  }, [displayedProducts, setProducts]);

  const loadMoreProducts = useCallback(async () => {
    if (!pageInfo?.endCursor) return { products: [], pageInfo };

    const params = new URLSearchParams(searchParams.toString());
    const sort = params.get("sort") ?? "";
    const { sortKey, reverse } =
      sorting.find((item) => item.slug === sort) || defaultSort;

    try {
      const { products: newProducts, pageInfo: newPageInfo } =
        await getCollectionProducts({
          collection,
          sortKey,
          reverse,
          after: pageInfo.endCursor,
          first: 18,
        });

      // Append new products to our local state of ALL products
      setAllLoadedProducts((prev) => [...prev, ...newProducts]);

      // Update page info for next pagination
      setPageInfo(newPageInfo);

      return { products: newProducts, pageInfo: newPageInfo };
    } catch (error) {
      return { products: [], pageInfo };
    }
  }, [pageInfo, collection, searchParams, setPageInfo]);

  return (
    <>
      <FiltersUpdater initialFilters={availableFilters} />

      <div className="mb-8 md:hidden">
        <MobileFilters />
      </div>

      {products.length === 0 ? (
        <p className="py-4 text-center">
          No se encontraron productos con los filtros seleccionados.
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
