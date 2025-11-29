import Subcategories from "@/components/collection/subcategories";
import { Pagination } from "@/components/common/pagination";
import FilterList from "@/components/layout/search/filter";
import { FiltersSidebar } from "@/components/layout/search/filters-sidebar";
import { getCollectionProducts } from "@/lib/shopify";
import { sorting, defaultSort } from "@/lib/constants";
import { CollectionClientPage } from "@/components/collection/collection-client-page";
import { ProductSearchProvider } from "@/context/ProductSearchContext";
import { FiltersProvider } from "@/context/FiltersContext";

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

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const currentPage = parseInt(page || "1", 10);

  const { products, pageInfo } = await getCollectionProducts({
    collection,
    sortKey,
    reverse,
    first: before ? undefined : 18,
    last: before ? 18 : undefined,
    after,
    before,
  });

  return (
    <section>
      {title === "Categoría" && <Subcategories title={collection} />}

      <ProductSearchProvider>
        <FiltersProvider>
          <div className="flex flex-col gap-8 text-black md:flex-row">
            <div className="order-first hidden flex-none md:block md:w-max sticky top-32 h-fit">
              <FiltersSidebar />
            </div>
            <div className="order-last min-h-screen w-full md:order-0">
              <CollectionClientPage
                initialProducts={products}
                initialPageInfo={pageInfo}
                collection={collection}
              />
            </div>
          </div>
        </FiltersProvider>
      </ProductSearchProvider>
    </section>
  );
}
