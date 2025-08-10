"use client";

import { Suspense, useState } from "react";

import { useStoreShoppingCart } from "@/store/shopping-cart";

import { ShoppingCart, MessageCircle, BadgeCheck } from "lucide-react";

interface Props {
  id: number;
  image: string;
  name: string;
  price: number;
  stock: number;
}

const getWhatsAppUrl = (productName: string, method: string) => {
  const message = `Hola, estoy interesado en el producto ${productName} y quiero pagarlo con ${method}`;
  return `https://wa.me/573502397570?text=${encodeURIComponent(message)}`;
};

export default function ProductInfo({ id, name, price, stock, image }: Props) {
  const { addProduct, products } = useStoreShoppingCart();

  const isProductInShoppingCart = products.some(
    (item) => item.id === id.toString(),
  );

  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("sin_credito");

  const increment = () => {
    setQuantity((prev) => (prev < stock ? prev + 1 : prev));
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleAddToCart = () => {
    addProduct({
      id: id.toString(),
      name,
      price,
      stock,
      image,
    });
  };

  const handleCheck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    alert("En el carrito");
  };

  return (
    <div className="flex w-full flex-col space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
      <p className="text-2xl font-semibold text-gray-700">
        ${price?.toLocaleString("es-CO")}
      </p>

      {stock > 1 && (
        <div className="flex items-center space-x-3">
          <span className="font-medium">Cantidad</span>
          <div className="flex items-center rounded border">
            <button
              onClick={decrement}
              className="bg-gray-100 px-3 py-1 hover:bg-gray-200"
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              onClick={increment}
              className="bg-gray-100 px-3 py-1 hover:bg-gray-200"
              disabled={quantity >= stock}
            >
              +
            </button>
          </div>
        </div>
      )}

      <label className="flex flex-col gap-1 text-sm font-medium">
        Método de pago
        <select
          name="paymentMethod"
          className="rounded border border-gray-300 p-2"
          onChange={handleChange}
          value={paymentMethod}
        >
          <optgroup label="Pago sin crédito">
            <option value="sin_credito">PayU</option>
          </optgroup>
          <optgroup label="Pago con crédito">
            <option value="addi">Addi</option>
            <option value="brilla">Brilla</option>
            <option value="gora">Gora</option>
            <option value="banco_bogota">Banco de Bogotá</option>
          </optgroup>
        </select>
      </label>

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        {paymentMethod !== "sin_credito" ? (
          <a
            href={getWhatsAppUrl(name, paymentMethod)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-green-500 p-3 text-center text-white hover:bg-green-600"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>
        ) : null}

        {isProductInShoppingCart ? (
          <button
            onClick={handleCheck}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-green-200 p-3 text-gray-900"
          >
            <BadgeCheck size={20} />
            Ya en el carrito
          </button>
        ) : (
          <button
            onClick={() => handleAddToCart()}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-blue-200 p-3 text-gray-900 hover:bg-blue-300"
          >
            <ShoppingCart size={20} />
            Agregar al carrito
          </button>
        )}
      </div>
    </div>
  );
}
