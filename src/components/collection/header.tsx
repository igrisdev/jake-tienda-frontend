"use client";

import { useGetParams } from "@/hooks/useGetParams";
import Link from "next/link";
import { useRef } from "react";

interface HeaderProps {
  bannerJBLData: any[];
}

export const Header = ({ bannerJBLData = [] }: HeaderProps) => {
  const { params: name } = useGetParams({ name: "title" });
  const { params: collection } = useGetParams({ name: "collection" });

  if (collection === "JBL") {
    const jblItem = bannerJBLData.length > 0 ? bannerJBLData[0] : null;

    if (jblItem) {
      return <HeaderByJBL data={jblItem} />;
    }
  }

  return (
    <section className="bg-linear-to-r from-blue-800 to-blue-500">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 text-center">
        <span className="mb-2 block text-sm font-medium text-white sm:text-lg">
          {name.length > 0 ? name : "Sin Categoría"}
        </span>
        <h1 className="text-2xl font-bold text-white uppercase sm:text-6xl">
          {collection.length > 0 ? collection : "Sin Colección"}
        </h1>
      </div>
    </section>
  );
};

interface BannerJBL {
  id: string;
  handle: string;
  image: any;
}

interface HeaderByJBLProps {
  data: BannerJBL;
}

export const HeaderByJBL = ({ data }: HeaderByJBLProps) => {
  const badgeRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLTableSectionElement>) => {
    if (!badgeRef.current) return;
    const x = e.clientX;
    const y = e.clientY;
    badgeRef.current.style.left = `${x}px`;
    badgeRef.current.style.top = `${y - 12}px`;
  };

  const imageUrl = data?.image?.image?.url || "/not-found.png";
  const productLink = data?.handle ? `/product/${data.handle}` : "#";

  return (
    <section
      className="group relative h-[500px] w-full cursor-none overflow-hidden bg-linear-to-r from-orange-600 to-orange-500"
      onMouseMove={handleMouseMove}
    >
      <Link href={productLink} className="block h-full w-full">
        <img
          src={imageUrl}
          alt="Imagen de banner de JBL Popayán"
          className="h-full w-full object-cover transition-transform duration-700"
        />
      </Link>

      <span
        ref={badgeRef}
        className="pointer-events-none fixed top-1 left-0 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-bold tracking-widest text-black uppercase opacity-0 shadow-2xl transition-opacity duration-200 ease-out will-change-transform group-hover:opacity-100"
      >
        Ver Producto
      </span>
    </section>
  );
};
