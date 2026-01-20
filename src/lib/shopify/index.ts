"use server";

import {
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  HIDDEN_PRODUCT_TAG,
  TAGS,
} from "@/lib/constants";
import { isShopifyError } from "../type-guards";
import { defaultFilters, ensureStartWith, extractFilters } from "../utils";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionsByCategoryAndBrandQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import {
  getNewProductsQuery,
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";
import { getPageQuery, getPagesQuery } from "./queries/page";
import { getPromoBannerQuery } from "./queries/bond";
import { getHeroItemsQuery } from "./queries/hero";
import { getBestProductPosterQuery } from "./queries/best-product";
import { ICategoryCart } from "@/types/category";
import { getInitialFilterData } from "./queries/filters";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getBannerJBLQuery } from "./queries/banner-jbl";

const domain = SHOPIFY_STORE_DOMAIN
  ? ensureStartWith(SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = SHOPIFY_STOREFRONT_ACCESS_TOKEN;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetch<T>({
  cache = "force-cache",
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key!,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    if (isShopifyError(error)) {
      throw {
        cause: error.cause?.toString() || "unknown",
        status: error.status || 500,
        message: error.message,
        query,
      };
    }

    throw {
      error,
      query,
    };
  }
}

function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
  return array.edges.map((edge) => edge?.node);
}

function reshapeImages(images: Connection<Image>, productTitle: string) {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];

    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
}
function reshapeProduct(
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
}

function reshapeProducts(products: ShopifyProduct[]) {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  function normalizeMenuItem(item: any): Menu {
    let path = item.url.replace(domain, "").replace("/pages", "");

    if (path === "/collections") {
      path = "/search";
    } else {
      path = path.replace("/collections", "/collection");
    }

    return {
      title: item.title,
      path: path,
      children: item.items?.map(normalizeMenuItem) || [],
    };
  }

  const normalizedMenu =
    res.body?.data?.menu?.items.map(normalizeMenuItem) || [];

  normalizedMenu.forEach((item) => {
    if (item.title === "Marcas" || item.title === "Categorías") {
      item.path = "#";
    }
  });

  return normalizedMenu;
}

interface ShopifyMenuItem {
  id: string;
  title: string;
  url: string;
  items?: ShopifyMenuItem[];
  resource?: {
    handle?: string;
    image?: { url: string; altText?: string };
  };
}

const normalizeChild = (item: ShopifyMenuItem): ICategoryCart => ({
  id: item.id,
  title: item.title,
  path: item.url
    .replace(domain, "")
    .replace("/collections", "/collection")
    .replace("/pages", ""),
  image: item.resource?.image?.url || null,
  altText: item.resource?.image?.altText || null,
});

function getMenuItems(
  res: any,
  menuTitle: "Categorías" | "Categorias" | "Marcas",
): ICategoryCart[] {
  const menu = (res.body?.data?.menu?.items as ShopifyMenuItem[]).find(
    (item) => item.title === menuTitle,
  );

  if (!menu) return [];

  return (
    menu.items
      ?.map(normalizeChild)
      .filter((item) => !item.path.includes("/frontpage")) || []
  );
}

export async function getCollectionCategoriesAndBrands(
  handle: string,
): Promise<{ categories: ICategoryCart[]; brands: ICategoryCart[] }> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getCollectionsByCategoryAndBrandQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  return {
    categories:
      getMenuItems(res, "Categorías") || getMenuItems(res, "Categorias"),
    brands: getMenuItems(res, "Marcas"),
  };
}

interface SubCategoryItem {
  id: string;
  title: string;
  path: string;
  url: string | null;
  children: SubCategoryItem[];
}

interface ParentCategory {
  id: string;
  title: string;
  children: SubCategoryItem[];
}

interface ShopifyMenuItem {
  id: string;
  title: string;
  url: string;
  resource?: {
    handle: string;
    image?: { url: string; altText: string | null };
  };
  items?: ShopifyMenuItem[];
}

export async function getSubcategories(
  handle: string, // ej. "main-menu"
  targetHandle: string, // ej. "alphatheta"
): Promise<ParentCategory | null> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getCollectionsByCategoryAndBrandQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  const menuItems = (res.body.data.menu?.items as ShopifyMenuItem[]) || [];

  const categoriesMenu = menuItems.find((item) => item.title === "Categorías");

  if (!categoriesMenu || !categoriesMenu.items) {
    return null;
  }

  const targetItem = categoriesMenu.items.find(
    (item) => item.resource?.handle === targetHandle,
  );

  if (!targetItem) {
    return null;
  }

  function normalizeChildItem(item: ShopifyMenuItem): SubCategoryItem {
    const path = item.url
      .replace(domain, "")
      .replace("/pages", "")
      .replace("/collections", "/collection");

    return {
      id: item.id,
      title: item.title,
      path: path,
      url: item.resource?.image?.url ?? null,
      children: item.items?.map(normalizeChildItem) || [],
    };
  }

  const finalResult: ParentCategory = {
    id: targetItem.id,
    title: targetItem.title,
    children: targetItem.items?.map(normalizeChildItem) || [],
  };

  return finalResult;
}

function reshapeCollection(
  collection: ShopifyCollection,
): Collection | undefined {
  if (!collection) return undefined;

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
}

function reshapeCollections(collections: ShopifyCollection[]) {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });

  const shopifyCollections = removeEdgesAndNodes(res?.body?.data?.collections);
  const collections = [
    {
      handle: "",
      title: "Todas",
      description: "All products",
      seo: {
        title: "Todas",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith("hidden"),
    ),
  ];

  return collections;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle,
    },
  });
  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId,
    },
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

function reshapeCart(cart: ShopifyCart): Cart {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: "USD",
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
}

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function getCart(
  cartId: string | undefined,
): Promise<Cart | undefined> {
  if (!cartId) return undefined;

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
  });

  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-cache",
  });

  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const topic = req.headers.get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");

  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];

  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
    revalidatePath("/");
    revalidatePath("/search");
  }
  if (isProductUpdate) {
    revalidateTag(TAGS.products);
    revalidatePath("/");
    revalidatePath("/search");
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    cache: "no-store",
    variables: { handle },
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
    cache: "no-store",
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getPromoBanner() {
  const res = await shopifyFetch({
    query: getPromoBannerQuery,
    tags: [TAGS.collections, TAGS.products],
  });

  const metaobject = res.body.data.metaobjects.edges[0]?.node;

  if (!metaobject) return null;

  const fields = metaobject.fields.reduce((acc, field) => {
    acc[field.key] = {
      value: field.value,
      reference: field.reference,
    };
    return acc;
  }, {});

  return {
    id: metaobject.id,
    title: fields.title.value,
    description: fields.description.value,
    product: fields.product_promo_banner.reference,
  };
}

export async function getHeroItems() {
  const res = await shopifyFetch({
    query: getHeroItemsQuery,
    tags: [TAGS.collections, TAGS.products],
  });

  const edges = res.body.data.metaobjects.edges;

  if (!edges?.length) return [];

  return edges.map(({ node }) => {
    const fields = node.fields.reduce((acc, field) => {
      acc[field.key] = field.reference ?? field.value;
      return acc;
    }, {});

    return {
      id: node.id,
      image: fields.image,
      handle: fields.product_selected?.handle,
    };
  });
}

export async function getBannerJBL() {
  const res = await shopifyFetch({
    query: getBannerJBLQuery,
    tags: [TAGS.collections, TAGS.products],
  });

  const edges = res.body.data.metaobjects.edges;

  if (!edges?.length) return [];

  return edges.map(({ node }) => {
    const fields = node.fields.reduce((acc, field) => {
      acc[field.key] = field.reference ?? field.value;
      return acc;
    }, {});

    return {
      id: node.id,
      image: fields.imagen,
      handle: fields.producto?.handle,
    };
  });
}

export async function getBestProductPoster() {
  const res = await shopifyFetch({
    query: getBestProductPosterQuery,
    tags: [TAGS.products, TAGS.collections],
  });

  const edges = res.body.data.metaobjects.edges;

  if (!edges?.length) return null;

  const node = edges[0].node;

  const fields = node.fields.reduce((acc, field) => {
    acc[field.key] = field.reference ?? field.value;
    return acc;
  }, {});

  const product = fields.product;

  return {
    id: node.id,
    product: product
      ? {
          handle: product.handle,
          title: product.title,
          tags: product.tags,
          image: product.featuredImage,
        }
      : null,
  };
}

export async function getNewProducts(): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getNewProductsQuery,
    tags: [TAGS.products],
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  first,
  last,
  after,
  before,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  first?: number;
  last?: number;
  after?: string;
  before?: string;
}): Promise<{ products: Product[]; pageInfo: any }> {
  if (collection === "all") {
    return getProducts({
      sortKey,
      reverse,
      first,
      last,
      after,
      before,
    });
  }

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse: false,
      sortKey: sortKey === "CREATED_AT" ? "PRICE" : sortKey,
      first,
      last,
      after,
      before,
    },
  });

  if (!res.body.data.collection) {
    return { products: [], pageInfo: {} };
  }

  const filters = extractFilters(res.body.data.collection.products.edges);

  return {
    products: reshapeProducts(
      removeEdgesAndNodes(res.body.data.collection.products),
    ),
    pageInfo: res.body.data.collection.products.pageInfo,
  };
}

export async function searchProducts({
  query,
  first = 20,
}: {
  query?: string;
  first?: number;
}): Promise<{ products: Product[]; filters: any }> {
  if (!query) return { products: [], filters: defaultFilters() };

  const res = await shopifyFetch<any>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query: `title:*${query}* OR tag:${query} OR vendor:${query}`,
      first,
    },
  });

  const products = res.body.data?.products;

  const filters = extractFilters(products?.edges || []);

  return {
    products: reshapeProducts(removeEdgesAndNodes(res.body.data?.products)),
    filters,
  };
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  first = 18,
  after,
  before,
  last,
  brands,
  category,
  types,
  priceMin,
  priceMax,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  first?: number;
  after?: string;
  before?: string;
  last?: number;
  brands?: string | string[];
  category?: string | string[];
  types?: string | string[];
  priceMin?: number;
  priceMax?: number;
}) {
  // 1. Construir la cadena de consulta para la API de Shopify
  const filterClauses: string[] = [];

  // Búsqueda de texto general
  if (query) {
    filterClauses.push(`(title:*${query}* OR tag:${query} OR vendor:${query})`);
  }

  // Filtro por Marcas (vendor)
  if (brands && brands.length > 0) {
    const brandClauses = (Array.isArray(brands) ? brands : [brands])
      .map((b) => `vendor:'${b}'`)
      .join(" OR ");
    filterClauses.push(`(${brandClauses})`);
  }

  // Filtro por Categorías (tag)
  if (category && category.length > 0) {
    const categoryClauses = (Array.isArray(category) ? category : [category])
      .map((c) => `tag:'${c}'`)
      .join(" OR ");
    filterClauses.push(`(${categoryClauses})`);
  }

  // Filtro por Tipo de Producto (product_type)
  if (types && types.length > 0) {
    const typeClauses = (Array.isArray(types) ? types : [types])
      .map((t) => `product_type:'${t}'`)
      .join(" OR ");
    filterClauses.push(`(${typeClauses})`);
  }

  // Filtro por Rango de Precios
  if (priceMin !== undefined) {
    filterClauses.push(`(price:>=${priceMin})`);
  }
  if (priceMax !== undefined) {
    filterClauses.push(`(price:<=${priceMax})`);
  }

  const finalQuery = filterClauses.join(" AND ");

  const res = await shopifyFetch<any>({
    query: getProductsQuery,
    variables: {
      query: finalQuery || undefined,
      reverse,
      sortKey,
      first,
      after,
      before,
      last,
    },
    tags: [TAGS.collections, TAGS.products],
  });

  const products = res.body.data?.products;

  return {
    products: reshapeProducts(removeEdgesAndNodes(products)),
    pageInfo: products?.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };
}

export async function initialFilterData() {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getInitialFilterData,
  });

  return res.body;
}
