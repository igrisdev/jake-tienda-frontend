"use client";

import { Suspense, useState } from "react";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";

interface Props {
  images: string[];
}

export default function ProductCarousel({ images }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  return (
    <Suspense fallback={<div className="h-full"></div>}>
      <div className="flex flex-col items-center space-y-4">
        <Swiper
          modules={[Navigation, Thumbs, Autoplay]}
          loop={true}
          spaceBetween={10}
          navigation
          thumbs={{ swiper: thumbsSwiper }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full max-w-lg rounded-lg"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <Image
                src={img ?? "/not-found.png"}
                alt={`Vista ${idx + 1}`}
                width={600}
                height={400}
                className="mx-auto object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Miniaturas (slider en móvil) */}
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={10}
          slidesPerView="auto"
          watchSlidesProgress
          className="w-full max-w-xs"
        >
          {images.map((img, idx) => (
            <SwiperSlide
              key={idx}
              className="flex !w-20 cursor-pointer justify-center"
            >
              <Image
                src={img ?? "/not-found.png"}
                alt={`Thumb ${idx + 1}`}
                width={80}
                height={60}
                className="rounded border border-gray-200 object-contain transition hover:scale-105"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
