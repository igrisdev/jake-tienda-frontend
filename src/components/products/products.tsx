"use client";

import { ProductsFilter } from "./products-filter";
import { ProductsGrid } from "./products-grid";
import { ProductsFilterMovilDrawer } from "../common/products-filter-movil-drawer";
import { usePagination } from "@/hooks/usePagination";
import { Suspense, useEffect, useState } from "react";
import { useStoreProducts } from "@/store/products";
import { useGetParams } from "@/hooks/useGetParams";
import { LoaderSpinner } from "../common/loaderSpinner";

export const Products = () => {
  const { currentPage, setPage } = usePagination();
  const { setAllProducts, setLoading } = useStoreProducts();
  const { params: search, loadingParams: loadingSearch } = useGetParams({
    name: "q",
  });

  const [pagination, setPagination] = useState<{
    pageCount: number;
    total: number;
    pageSize: number;
    page: number;
  }>();

  const getProductsByPage = async ({ page }: { page: number }) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/strapi/all-products?page=${page}`);
      const data = await res.json();

      setAllProducts(data.products);
      setPagination(data.meta);
    } catch (err) {
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByPageAndSearch = async ({
    search,
    page,
  }: {
    search: string;
    page: number;
  }) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/strapi/search?q=${encodeURIComponent(search)}&page=${page}`,
      );
      const data = await res.json();

      setAllProducts(data.products);
      setPagination(data.meta);
    } catch (err) {
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadingSearch) return;

    if (search !== "") {
      getProductsByPageAndSearch({ search: search, page: currentPage });
      return;
    } else if (search === "") {
      getProductsByPage({ page: currentPage });
      return;
    }
  }, [currentPage, search, loadingSearch]);

  return (
    <Suspense fallback={<LoaderSpinner />}>
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:py-10">
        <ProductsFilterMovilDrawer />

        <div className="relative flex min-h-[50vh] w-full gap-6">
          <ProductsFilter />

          <ProductsGrid
            currentPage={currentPage}
            setPage={setPage}
            pagination={pagination}
          />
        </div>
      </div>
    </Suspense>
  );
};
