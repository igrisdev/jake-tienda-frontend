"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Product, PageInfo } from "@/lib/shopify/types";

interface ProductSearchContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  pageInfo: PageInfo | null;
  setPageInfo: React.Dispatch<React.SetStateAction<PageInfo | null>>;
}

const ProductSearchContext = createContext<
  ProductSearchContextType | undefined
>(undefined);

export function ProductSearchProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  return (
    <ProductSearchContext.Provider
      value={{ products, pageInfo, setProducts, setPageInfo }}
    >
      {children}
    </ProductSearchContext.Provider>
  );
}

export function useProductSearch() {
  const context = useContext(ProductSearchContext);
  if (context === undefined) {
    throw new Error(
      "useProductSearch must be used within a ProductSearchProvider",
    );
  }
  return context;
}
