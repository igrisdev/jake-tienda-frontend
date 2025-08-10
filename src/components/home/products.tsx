import Link from "next/link";
import Image from "next/image";

import { newProducts } from "@/service/api/product";
import { IBestProduct, IProductFilter } from "@/types/product";
import { bestProduct } from "@/service/api/best-product";
import { CarouselProducts } from "./carousel-products";

export const Products = async () => {
  const carouselNewProducts = (await newProducts()) as IProductFilter[];
  const bestProductInfo = (await bestProduct()) as IBestProduct;

  if (!bestProductInfo.image) return null;

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4">
      <div className="pb-10">
        <h2 className="text-center text-3xl font-bold">¡Productos Nuevos!</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <section className="overflow-hidden rounded-sm sm:col-span-1">
          <div className="h-auto w-full sm:h-full">
            <Link href={"/view-product/" + bestProductInfo.slug}>
              <Image
                src={bestProductInfo.image}
                alt={bestProductInfo.name}
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        </section>

        <section className="h-full w-full sm:col-span-3">
          <CarouselProducts products={carouselNewProducts} />
        </section>
      </div>
    </section>
  );
};
