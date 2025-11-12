import { Pagination } from "@/components/common/pagination";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { getProducts, initialFilterData } from "@/lib/shopify";
import { sorting, defaultSort } from "@/lib/constants";
import FiltersUpdater from "@/components/layout/search/filters-updater";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const sp = searchParams || {};

  // Leer parámetros de la URL. Ahora se pasan directamente.
  const sort = (sp?.sort as string) ?? "";
  const searchValue = (sp?.q as string) ?? "";
  const brands = sp?.brands; // Puede ser string o string[]
  const category = sp?.category; // Puede ser string o string[]
  const types = sp?.types; // Añadido para consistencia
  const priceMin = sp?.price_min ? Number(sp.price_min) : undefined;
  const priceMax = sp?.price_max ? Number(sp.price_max) : undefined;

  const after = sp?.after as string | undefined;
  const before = sp?.before as string | undefined;
  const page: number = sp?.page ? Number(sp.page) : 1;

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Pasamos todos los filtros a getProducts
  const { products, pageInfo } = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
    first: before ? undefined : 18,
    last: before ? 18 : undefined,
    after,
    before,
    brands,
    category,
    types, // Pasamos los tipos también
    priceMin,
    priceMax,
  });

  const body = await initialFilterData();

  const categories = body.data.productTypes.edges.map((edge: any) => edge.node);
  const tags = body.data.productTags.edges.map((edge: any) => edge.node);
  const allVendors = body.data.products.edges.map(
    (edge: any) => edge.node.vendor,
  );
  const uniqueVendors = [...new Set(allVendors)];
  const allPrices = body.data.products.edges.map((edge: any) =>
    parseFloat(edge.node.priceRange.maxVariantPrice.amount),
  );
  const priceRange = {
    min: allPrices.length ? Math.min(...allPrices) : 0,
    max: allPrices.length ? Math.max(...allPrices) : 0,
  };

  const initialFilters = {
    brands: uniqueVendors,
    categories: categories,
    types: tags,
    priceRange: priceRange,
  };

  console.log(initialFilters);

  return (
    <div className="flex gap-6">
      <FiltersUpdater initialFilters={initialFilters} />

      <div className="flex-1">
        {products.length === 0 ? (
          <p>No se encontraron productos con estos filtros.</p>
        ) : (
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        )}
        <Pagination
          pageInfo={pageInfo}
          currentPage={page}
          searchValue={searchValue}
          sort={sort}
        />
      </div>
    </div>
  );
}
