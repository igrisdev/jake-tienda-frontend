"use client";

import { StaticImageData } from "next/image";
import Link from "next/link";

type Props = {
  data: any;
  bg?: string | StaticImageData;
  cta?: string;
  tagline?: string;
  className?: string;
};

export default function BestProductPoster({
  data,
  bg,
  cta = "Ver producto",
  tagline = "Descubre los nuevos productos que tenemos para ti",
  className = "",
}: Props) {
  if (!data?.product) return null;

  const bgUrl = typeof bg === "string" ? bg : bg?.src;

  const brand = data.product.tags;

  return (
    <Link
      href={`/product/${data.product.handle}`}
      className={`group block h-full w-full ${className}`}
      aria-label={`Ver ${brand ? `${brand} ` : ""}${data.product.title}`}
    >
      <article
        className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10"
        style={
          bgUrl
            ? {
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />

        <header className="px-6 pt-6 sm:px-6 sm:pt-8">
          {brand ? (
            <p className="text-center text-sm font-semibold tracking-wide text-black/80 uppercase italic">
              {brand}
            </p>
          ) : null}
          <h3 className="mt-3 text-center text-3xl leading-none font-black tracking-tight text-black sm:text-4xl">
            {data.product.title}
          </h3>
        </header>

        <div className="relative mx-auto mt-2 aspect-[5/4] w-[92%] flex-1 sm:aspect-[4/3] lg:aspect-[16/9]">
          {/* <Image
            src={data.product.image?.url}
            alt={data.product.title}
            fill
            // priority
            sizes="(max-width: 740px) 92vw, (max-width: 1024px) 40vw, 25vw"
            className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-[1.02]"
          /> */}
          <img
            src={data.product.image?.url ?? "/not-found.png"}
            alt={data.product.title}
            className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />
        </div>

        <footer className="px-6 pt-3 pb-6 sm:px-3 sm:pb-7">
          <p className="text-center text-sm leading-snug font-semibold text-black">
            {tagline}
          </p>
        </footer>
      </article>
    </Link>
  );
}
