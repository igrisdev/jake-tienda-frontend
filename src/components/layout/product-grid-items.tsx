import Link from "next/link";
import { Product } from "@/lib/shopify/types";
import Price from "../price";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      key={product.id}
      href={`/product/${product.handle}`}
      prefetch={true}
      aria-label={`Ver ${product.title}`}
      className="group relative h-full w-full overflow-hidden rounded-sm border border-blue-400 p-6 transition hover:border-blue-700"
    >
      <article className="flex h-full flex-col justify-between gap-2 sm:gap-4">
        <header className="relative aspect-square w-full">
          {/* <Image
            src={product.featuredImage.url ?? "/not-found.png"}
            alt={product.featuredImage.altText || product.title}
            width={300}
            height={300}
            className="object-contain"
            priority
            // unoptimized
          /> */}
          {!product.availableForSale && (
            <div className="absolute top-0 left-0 z-10 flex items-center justify-center rounded-full bg-black/80 px-2 py-1 text-xs text-white backdrop-blur-2xl">
              <span>Agotado</span>
            </div>
          )}
          <img
            src={product.featuredImage?.url ?? "/not-found.png"}
            alt={product.featuredImage?.altText || product.title}
            className="object-contain w-full h-full"
            referrerPolicy="no-referrer"
          />
        </header>
        <main>
          <h3 className="line-clamp-3 text-left text-sm font-medium text-blue-600 sm:text-base">
            {product.title}
          </h3>
        </main>
        <footer>
          <Price
            className="text-left text-xs font-medium text-black sm:text-sm md:text-base"
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            currencyCodeClassName="hidden src[275px]/label:inline"
          />
        </footer>
      </article>
    </Link>
  );
};
