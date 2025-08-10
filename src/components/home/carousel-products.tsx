"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "@/styles/home/carrousel-products.css";

import { IProductFilter } from "@/types/product";
import { CartProduct } from "../common/cart-product";
import { Suspense } from "react";

export const CarouselProducts = ({
  products,
}: {
  products: IProductFilter[];
}) => {
  return (
    <Suspense fallback={<div className="h-72"></div>}>
      <Swiper
        slidesPerView={1}
        spaceBetween={4}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 4,
          },
          1008: {
            slidesPerView: 3,
            spaceBetween: 4,
          },
        }}
        modules={[Pagination]}
        loop={true}
        className="!pb-10"
      >
        {products.slice(0, 8).map((product) => (
          <SwiperSlide key={product.id}>
            <CartProduct product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Suspense>
  );
};
