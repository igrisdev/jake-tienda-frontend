import { Pagination } from "@/components/common/pagination";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { getProducts } from "@/lib/shopify";
import { sorting, defaultSort } from "@/lib/constants";
import FiltersUpdater from "@/components/layout/search/filters-updater";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const sort = (sp?.sort as string) ?? "";
  const searchValue = (sp?.q as string) ?? "";
  const brands = (sp?.brands as string) ?? "";
  const category = (sp?.category as string) ?? "";
  const priceMin = sp?.price_min ? Number(sp.price_min) : undefined;
  const priceMax = sp?.price_max ? Number(sp.price_max) : undefined;

  const after = sp?.after as string | undefined;
  const before = sp?.before as string | undefined;
  const page: number = sp?.page ? Number(sp.page) : 1;

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const { products, pageInfo, filters } = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
    first: before ? undefined : 18,
    last: before ? 18 : undefined,
    after,
    before,
    brands,
    category,
    priceMin,
    priceMax,
  });

  return (
    <div className="flex gap-6">
      <FiltersUpdater filters={filters} />

      <div className="flex-1">
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
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
