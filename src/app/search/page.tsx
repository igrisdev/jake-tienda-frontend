import { getProducts, initialFilterData } from "@/lib/shopify";
import { sorting, defaultSort } from "@/lib/constants";
import { SearchClientPage } from "@/components/common/client-page";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const sp = await (searchParams || {});

  const sort = (sp?.sort as string) ?? "";
  const searchValue = (sp?.q as string) ?? "";
  const brands = sp?.brands;
  const category = sp?.category;
  const types = sp?.types;
  const priceMin = sp?.price_min ? Number(sp.price_min) : undefined;
  const priceMax = sp?.price_max ? Number(sp.price_max) : undefined;

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const [{ products, pageInfo }, body] = await Promise.all([
    getProducts({
      sortKey,
      reverse,
      query: searchValue,
      first: 18,
      brands,
      category,
      types,
      priceMin,
      priceMax,
    }),
    initialFilterData(),
  ]);

  const productTypes = body.data.productTypes.edges
    .map((edge: any) => edge.node)
    .filter(Boolean);

  const productTags = body.data.productTags.edges.map((edge: any) => edge.node);

  const uniqueVendors = [
    ...new Set(body.data.products.edges.map((edge: any) => edge.node.vendor)),
  ];

  const allPrices = body.data.products.edges.map((edge: any) =>
    parseFloat(edge.node.priceRange.maxVariantPrice.amount),
  );

  const priceRange = {
    min: allPrices.length ? Math.min(...allPrices) : 0,
    max: allPrices.length ? Math.max(...allPrices) : 0,
  };

  const initialFilters = {
    brands: uniqueVendors,
    categories: productTags,
    types: productTypes,
    priceRange: priceRange,
  };

  return (
    <SearchClientPage
      initialProducts={products}
      initialPageInfo={pageInfo}
      initialFilters={initialFilters}
    />
  );
}
