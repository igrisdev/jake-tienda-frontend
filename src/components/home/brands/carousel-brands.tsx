"use client";

import { useState } from "react";
import { ICategoryCart } from "@/types/category";

// import Image from "next/image";
import Link from "next/link";

export const CarouselBrands = ({ brands }: { brands: ICategoryCart[] }) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="overflow-hidden">
      <div
        className="relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onPointerCancel={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onClick={() => setIsPaused((prev) => !prev)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div
          className="carousel-brands-track flex w-max gap-16"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {brands.map((brand, idx) => (
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

          {brands.map((brand, idx) => (
            <Link
              key={`clone-${idx}`}
              href={brand.path + "?title=Marca" + "&collection=" + brand.title}
              className="relative h-24 w-48 shrink-0 items-center justify-center transition-transform hover:scale-105"
              aria-hidden="true"
              tabIndex={-1}
            >
              <img
                src={brand.image ?? "/not-found.png"}
                alt={brand.title}
                className="h-full w-full object-contain"
              />
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-brands-track {
          animation: carousel-brands-marquee 32s linear infinite;
          will-change: transform;
        }

        @keyframes carousel-brands-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};
