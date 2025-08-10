"use client";

import Link from "next/link";

import { useStore } from "@/hooks/useStore";
import { ICartState, useStoreShoppingCart } from "@/store/shopping-cart";
import { ShoppingCardProduct } from "../common/shoppingCardProduct";

export const InfoShoppingCart = () => {
  const cartStore = useStore<ICartState, ICartState>(
    useStoreShoppingCart,
    (state: ICartState) => state,
  );

  if (!cartStore) return null;

  const { products, getTotalPrice } = cartStore;

  return (
    <div className="h-fit bg-blue-50 p-4">
      <div className="flex flex-col gap-4 rounded-xs border border-gray-300 bg-white">
        <section className="border-b border-gray-300 p-4">
          <h2 className="text-xl font-medium">Resumen del pedido</h2>
        </section>

        <section className="grid gap-2 px-4">
          {products.length === 0 ? (
            <Link
              href="/products"
              className="py-4 text-lg text-gray-500 hover:text-blue-800"
            >
              Agrega productos para comenzar a comprar.
            </Link>
          ) : (
            products.map((product) => (
              <ShoppingCardProduct key={product.id} product={product} />
            ))
          )}
        </section>

        <section className="flex justify-between gap-2 border-t border-gray-300 p-4">
          <h2 className="text-xl font-medium">Total</h2>

          <p className="text-xl font-bold">
            ${getTotalPrice().toLocaleString("es-CO")}
          </p>
        </section>
      </div>
    </div>
  );
};
