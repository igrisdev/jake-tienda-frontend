"use client";

import { ICategoryCart } from "@/types/category";
import { motion } from "framer-motion";

// import Image from "next/image";
import Link from "next/link";

export const CarouselBrands = ({ brands }: { brands: ICategoryCart[] }) => {
  const loopedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="overflow-hidden">
      <div className="relative w-full overflow-hidden py-2">
        <motion.div
          className="flex gap-16"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          }}
          style={{ width: `${loopedBrands.length * 200}px` }}
        >
          {loopedBrands.map((brand, idx) => (
            <Link
              key={idx}
              href={brand.path + "?title=Marca" + "&collection=" + brand.title}
              className="relative h-24 w-48 shrink-0 items-center justify-center transition-transform hover:scale-105"
            >
              {/* <Image
                src={brand.image ?? "/not-found.png"}
                alt={brand.title}
                fill
                className="object-contain"
                priority={idx < brands.length}
                sizes="(max-width: 768px) 120px, (max-width: 1200px) 160px, 200px"
                // unoptimized
              /> */}
              <img
                src={brand.image ?? "/not-found.png"}
                alt={brand.title}
                className="h-full w-full object-contain"
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
