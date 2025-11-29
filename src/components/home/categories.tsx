import Link from "next/link";

import { ICategoryCart } from "@/types/category";
import { getCollectionCategoriesAndBrands } from "@/lib/shopify";
import { MAIN_MENU } from "@/lib/constants";

export const Categories = async () => {
  const { categories } = await getCollectionCategoriesAndBrands(MAIN_MENU);

  if (categories.length < 1) return null;

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4">
      <div>
        <h2 className="py-10 text-center text-3xl font-bold">Categorías</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.slice(0, 20).map((category) => (
          <CardCategory key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

const CardCategory = ({ category }: { category: ICategoryCart }) => {
  return (
    <Link
      href={
        category.path + "?title=Categoría" + "&collection=" + category.title
      }
      className="overflow-hidden border border-gray-100 p-2 transition-all duration-100 ease-in-out hover:border-blue-300 hover:shadow-xs"
    >
      <article className="flex flex-col gap-4 overflow-hidden rounded-sm">
        <div className="aspect-square">
          {/* <Image
            src={category?.image ?? "/not-found.png"}
            alt={category.altText ?? category.title}
            className="h-full w-full object-cover"
            width={400}
            height={400}
          /> */}
          <img
            src={category?.image ?? "/not-found.png"}
            alt={category.altText ?? category.title}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="text-center text-lg font-semibold">{category.title}</h3>
      </article>
    </Link>
  );
};
