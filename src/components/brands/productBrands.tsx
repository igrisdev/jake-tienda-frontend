"use client";

import { useGetParams } from "@/hooks/useGetParams";
import { usePagination } from "@/hooks/usePagination";
import { useStoreProducts } from "@/store/products";
import { Suspense, useEffect, useState } from "react";
import { ViewProducts } from "./viewProducts";
import { Header } from "../categories/header";
import { LoaderSpinner } from "../common/loaderSpinner";

export const ProductBrands = () => {
  const { currentPage, setPage } = usePagination();
  const { setAllProducts, setLoading } = useStoreProducts();

  const { params: brand, loadingParams: loadingBrand } = useGetParams({
    name: "brand",
  });

  const [pagination, setPagination] = useState<{
    pageCount: number;
    total: number;
    pageSize: number;
    page: number;
  }>();

  const getProductsByCategoryAndBrand = async ({
    name,
    search,
    page,
  }: {
    name: string;
    search: string;
    page: number;
  }) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/strapi/search/category-and-brand?${name}=${encodeURIComponent(search)}&page=${page}`,
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
    if (!brand || loadingBrand) return;

    getProductsByCategoryAndBrand({
      name: "brand",
      search: brand,
      page: currentPage,
    });
  }, [brand, currentPage, loadingBrand]);

  return (
    <Suspense fallback={<LoaderSpinner />}>
      <div className="grid gap-4">
        <Header title={brand} name="Marcas" />

        <div className="mx-auto grid w-full max-w-7xl gap-4 p-4 px-4 py-3">
          <ViewProducts
            currentPage={currentPage}
            setPage={setPage}
            pagination={pagination}
          />
        </div>
      </div>
    </Suspense>
  );
};
