import { Pagination } from "@/components/common/pagination";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";

export const metadata = {
  title: "Buscar",
  description: "Buscar productos en la tienda.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const sort = (sp?.sort as string) ?? "";
  const searchValue = (sp?.q as string) ?? "";
  const after = sp?.after as string | undefined;
  const before = sp?.before as string | undefined;
  const page: number = sp?.page ? Number(sp.page) : 1;

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const { products, pageInfo } = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
    first: before ? undefined : 18,
    last: before ? 18 : undefined,
    after,
    before,
  });

  const resultsText = products.length > 1 ? "resultados" : "resultado";
  const currentPage: number = parseInt(String(page || "1"), 10);

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "No hay productos que coincidan "
            : `Mostrando ${products.length} ${resultsText} para `}
          <span>&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
          <Pagination
            pageInfo={pageInfo}
            currentPage={currentPage}
            searchValue={searchValue}
            sort={sort}
          />
        </>
      ) : null}
    </>
  );
}
