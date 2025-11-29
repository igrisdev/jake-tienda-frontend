import { MAIN_MENU } from "@/lib/constants";
import { getSubcategories } from "@/lib/shopify";
import Link from "next/link";

export default async function Subcategories({ title }: { title: string }) {
  if (title == null || title === "") return null;

  const subcategories = await getSubcategories(MAIN_MENU, title);

  if (!subcategories || subcategories.children.length === 0) {
    return null;
  }

  const subcategoriesItems = subcategories.children;

  return (
    <section className="mb-8 w-full">
      <h2 className="mb-4 rounded-sm bg-linear-120 from-blue-800 to-blue-500 py-2 pl-2 text-left text-2xl font-semibold text-white">
        Subcategorías
      </h2>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {subcategoriesItems.map((item) => (
          <li key={item.id} className="group">
            <Link
              href={
                item.path + "?title=Subcategoría" + "&collection=" + item.title
              }
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                <img
                  src={item.url ?? "/not-found.png"}
                  alt={item.title}
                  // Clases para hacer que <img> sea responsiva y se ajuste
                  className="h-full w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                  // Atributos adicionales para rendimiento y accesibilidad
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <span className="block text-xs font-semibold tracking-wider text-gray-700 uppercase transition-colors group-hover:text-blue-600 sm:text-sm">
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <hr className="mt-8 text-blue-400" />
    </section>
  );
}
