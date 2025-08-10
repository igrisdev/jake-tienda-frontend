"use client";

import { Header } from "./header";
import { usePagination } from "@/hooks/usePagination";
import { Suspense, useEffect, useState } from "react";
import { useStoreProducts } from "@/store/products";
import { useGetParams } from "@/hooks/useGetParams";
import { ViewProducts } from "./viewProducts";
import { LoaderSpinner } from "../common/loaderSpinner";

export const ProductCategoires = () => {
  const { currentPage, setPage } = usePagination();
  const { setAllProducts, setLoading } = useStoreProducts();

  const { params: category, loadingParams: loadingcategory } = useGetParams({
    name: "category",
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
    if (!category || loadingcategory) return;

    getProductsByCategoryAndBrand({
      name: "category",
      search: category,
      page: currentPage,
    });
  }, [category, currentPage, loadingcategory]);

  return (
    <Suspense fallback={<LoaderSpinner />}>
      <div className="grid gap-4">
        <Header title={category} name="Categorías" />

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
