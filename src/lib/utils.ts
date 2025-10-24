import { ReadonlyURLSearchParams } from "next/navigation";

export function ensureStartWith(stringToCheck: string, startsWith: string) {
  return stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;
}

export function createUrl(
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
}

export function extractFilters(products: any[] = []) {
  if (!Array.isArray(products) || products.length === 0) {
    return defaultFilters();
  }

  const brands = new Set<string>();
  const categories = new Set<string>();
  const prices: number[] = [];

  for (const p of products) {
    if (!p) continue;

    const product = p.node;

    for (const c of product.collections.edges) {
      if (c.node.handle) categories.add(c.node.handle);
    }

    for (const b of product.tags) {
      if (b) brands.add(b);
    }

    const minPrice = Number(product.priceRange?.minVariantPrice?.amount ?? 0);
    const maxPrice = Number(product.priceRange?.maxVariantPrice?.amount ?? 0);

    if (minPrice > 0) prices.push(minPrice);
    if (maxPrice > 0) prices.push(maxPrice);
  }

  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  return {
    brands: Array.from(brands),
    categories: Array.from(categories),
    priceRange: { min, max },
  };
}

export function defaultFilters() {
  return {
    brands: [],
    categories: [],
    priceRange: { min: 0, max: 0 },
  };
}
