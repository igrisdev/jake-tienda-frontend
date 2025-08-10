"use client";

import { IBrandWithImage } from "@/types/navbar";
import { motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";

export const TrustSection = ({ brands }: { brands: IBrandWithImage[] }) => {
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
              href={"/brands?brand=" + brand.name}
              className="flex h-24 w-48 flex-shrink-0 items-center justify-center transition-transform hover:scale-105"
            >
              <Image
                src={brand.logo ?? "/not-found.png"}
                alt={brand.name}
                width={160}
                height={80}
                className="object-contain"
                priority={idx < brands.length}
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
