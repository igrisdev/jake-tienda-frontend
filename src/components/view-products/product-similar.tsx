"use client";

import { CartProduct } from "../common/cart-product";
import { IProductCart } from "@/types/product";

interface Props {
  products: IProductCart[];
}

export default function ProductSimilar({ products }: Props) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Productos Similares</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 8).map((product) => (
          <CartProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
