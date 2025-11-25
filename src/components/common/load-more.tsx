"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { PageInfo } from "@/lib/shopify/types";

const Spinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
  </div>
);

type LoadMoreProps = {
  loadMoreProducts: () => Promise<{ products: any[]; pageInfo: PageInfo }>;
  pageInfo: PageInfo;
};

export function LoadMore({ loadMoreProducts, pageInfo }: LoadMoreProps) {
  const [ref, inView] = useInView();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (inView && !loading && pageInfo.hasNextPage) {
        setLoading(true);
        await loadMoreProducts();
        setLoading(false);
      }
    };
    load();
  }, [inView, loading, pageInfo, loadMoreProducts]);

  if (!pageInfo.hasNextPage) {
    return null;
  }

  return (
    <div ref={ref} className="mt-8">
      {loading && <Spinner />}
    </div>
  );
}
