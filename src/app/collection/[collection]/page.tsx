import Subcategories from "@/components/collection/subcategories";
import { Pagination } from "@/components/common/pagination";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import FilterList from "@/components/layout/search/filter";
import { FiltersSidebar } from "@/components/layout/search/filters-sidebar";
import { getCollectionProducts } from "@/lib/shopify";

import type { Metadata } from "next";

function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ");
}

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await props.params;

  const titleFromSlug = slugToTitle(collection);

  const pageTitle = `${titleFromSlug} | Jake Tienda Electrónica`;
  const description = `Compra ${titleFromSlug} en Jake Tienda Electrónica: parlantes, consolas, controladoras DJ, subwoofers y más. Envío nacional y opciones de financiación.`;

  const ogImage = "/favicong.svg";

  return {
    title: pageTitle,
    description,
    keywords: [
      `${titleFromSlug.toLowerCase()} colombia`,
      "audio profesional",
      "parlantes",
      "controladoras dj",
      "subwoofers",
      "tecnología de sonido",
      "jake tienda electrónica",
    ],
    alternates: {
      canonical: `/collection/${collection}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title: pageTitle,
      description,
      type: "website",
      url: `/collection/${collection}`,
      siteName: "Jake Tienda Electrónica",
      locale: "es_CO",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Jake Tienda Electrónica",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { collection } = await props.params;
  const searchParams = await props.searchParams;

  const { sort, after, before, page, title } = (searchParams || {}) as {
    [key: string]: string;
  };

  const currentPage = parseInt(page || "1", 10);

  const { products, pageInfo } = await getCollectionProducts({
    collection,
    sortKey: "PRICE",
    reverse: false,
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
          {title === "Categoría" && <Subcategories title={collection} />}

          <div className="flex flex-col gap-8 text-black md:flex-row">
            {/* <div className="order-first hidden flex-none md:block md:w-max">
              <FiltersSidebar />
            </div> */}
            <div className="order-last min-h-screen w-full md:order-0">
              <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <ProductGridItems products={products} />
              </Grid>
            </div>
            <div className="order-0 flex-none md:order-last md:w-max">
              {/* <FilterList list={sorting} title="Ordenar por" /> */}
            </div>
          </div>

          <Pagination
            pageInfo={pageInfo}
            currentPage={currentPage}
            searchValue={collection}
            sort={sort ?? ""}
            collection={{
              title,
              collection,
            }}
          />
        </>
      )}
    </section>
  );
}

{
  /* <FiltersProvider>
      <div className="mx-auto flex max-w-9xl flex-col gap-8 px-4 pt-6 pb-4 text-black md:flex-row">
        <div className="order-first flex-none hidden md:block md:w-max">
          <FiltersSidebar />
        </div>
        <div className="order-last min-h-screen w-full md:order-0">
          {children}
        </div>
        <div className="order-0 flex-none md:order-last md:w-max">
          <FilterList list={sorting} title="Ordenar por" />
        </div>
      </div>
    </FiltersProvider> */
}
