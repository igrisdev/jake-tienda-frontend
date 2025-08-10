"use client";

import { Suspense } from "react";
import { CartProduct } from "../common/cart-product";
import { IProductFilter } from "@/types/product";

interface Props {
  products: IProductFilter[];
}

export default function ProductSimilar({ products }: Props) {
  return (
    <Suspense fallback={<div className="h-full"></div>}>
      <div>
        <h2 className="mb-6 text-2xl font-bold">Productos Similares</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 8).map((product) => (
            <CartProduct key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Suspense>
  );
}
