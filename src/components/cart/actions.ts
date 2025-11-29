"use server";

import { TAGS } from "@/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  const cookieStore = await cookies();
  const cartId = cookieStore?.get("cartId")?.value;

  if (!cartId || !selectedVariantId) {
    return "Error al añadir al carrito";
  }

  const cart = await getCart(cartId);
  if (!cart) {
    return "Error al actualizar el carrito";
  }

  const isItemInCart = cart.lines.some(
    (line) => line.merchandise.id === selectedVariantId,
  );

  try {
    if (!isItemInCart) {
      await addToCart(cartId, [
        { merchandiseId: selectedVariantId, quantity: 1 },
      ]);
    }

    revalidateTag(TAGS.cart);
  } catch (error) {
    return "Error al añadir al carrito";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  const cookieStore = await cookies();
  const cartId = cookieStore?.get("cartId")?.value;
  if (!cartId) {
    return "Falta el ID del carrito";
  }

  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error al actualizar el carrito";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (error) {
    return "Error al actualizar el carrito";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore?.get("cartId")?.value;

  if (!cartId) {
    return "Falta el ID del carrito";
  }

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error al actualizar el carrito";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return "Producto no encontrado en el carrito";
    }
  } catch (error) {
    return "Error de eliminación del producto del carrito";
  }
}

export async function redirectToCheckout() {
  const cookieStore = await cookies();
  const cartId = cookieStore?.get("cartId")?.value;

  if (!cartId) {
    return "Falta el ID del carrito";
  }

  const cart = await getCart(cartId);

  if (!cart) {
    return "Error al actualizar el carrito";
  }

  redirect(cart.checkoutUrl);
}

export async function createCartAndSetCookie() {
  const cookieStore = await cookies();
  const cart = await createCart();
  cookieStore.set("cartId", cart.id!);
}
