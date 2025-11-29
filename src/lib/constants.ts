export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Últimas Novedades",
  slug: null,
  sortKey: "CREATED_AT",
  reverse: true,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Tendencias",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  }, // asc
  {
    title: "Precio: De menor a mayor",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "Precio: De mayor a menor",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const MAIN_MENU = "main-menu-subcategorias";

export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2025-10/graphql.json";
export const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
