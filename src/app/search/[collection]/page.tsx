import { Pagination } from "@/components/common/pagination";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/lib/constants";
import { getCollectionProducts } from "@/lib/shopify";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, after, before, page } = searchParams as {
    [key: string]: string;
  };

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const currentPage = parseInt(page || "1", 10);

  const { products, pageInfo } = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
    first: before ? undefined : 18,
    last: before ? 18 : undefined,
    after,
    before,
  });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No se han encontrado productos en esta colección`}</p>
      ) : (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>

          <Pagination
            pageInfo={pageInfo}
            currentPage={currentPage}
            searchValue={params.collection}
            sort={sort ?? ""}
          />
        </>
      )}
    </section>
  );
}
