"use client";

import { useGetParams } from "@/hooks/useGetParams";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

interface HeaderProps {
  bannerJBLData: any[];
}

export const Header = ({ bannerJBLData = [] }: HeaderProps) => {
  const { params: name } = useGetParams({ name: "title" });
  const { params: collection } = useGetParams({ name: "collection" });

  if (collection === "JBL" && bannerJBLData.length > 0) {
    return <HeaderByJBL items={bannerJBLData} />;
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

interface BannerJBLItem {
  id: string;
  handle: string;
  image: {
    image: {
      url: string;
      altText?: string | null;
    };
  } | null;
}

interface HeaderByJBLProps {
  items: BannerJBLItem[];
}

export const HeaderByJBL = ({ items }: HeaderByJBLProps) => {
  // Normalize each Shopify metaobject item into a flat slide
  const slides = items.map((item) => ({
    url: item?.image?.image?.url || "/not-found.png",
    handle: item?.handle || "",
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const mouseDragStart = useRef<number | null>(null);
  const isDragging = useRef(false);
  const wasDragged = useRef(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isMobile || isHovered) return;
    const tickRate = 50;
    const totalTime = 5000;
    const increment = (tickRate / totalTime) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + increment));
    }, tickRate);
    return () => clearInterval(timer);
  }, [slides.length, isHovered, isMobile]);

  useEffect(() => {
    if (progress >= 100) nextSlide();
  }, [progress]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!badgeRef.current) return;
    badgeRef.current.style.left = `${e.clientX}px`;
    badgeRef.current.style.top = `${e.clientY - 12}px`;
    if (isDragging.current && mouseDragStart.current !== null) {
      if (Math.abs(e.clientX - mouseDragStart.current) > 5) wasDragged.current = true;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDragStart.current = e.clientX;
    isDragging.current = true;
    wasDragged.current = false;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseDragStart.current === null) return;
    const distance = mouseDragStart.current - e.clientX;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    isDragging.current = false;
    mouseDragStart.current = null;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    mouseDragStart.current = null;
    setIsHovered(false);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (wasDragged.current) {
      e.stopPropagation();
      e.preventDefault();
      wasDragged.current = false;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section
      className="group relative h-[500px] w-full cursor-grab overflow-hidden bg-linear-to-r from-orange-600 to-orange-500 select-none active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClickCapture={handleClickCapture}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding track */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative h-full w-full shrink-0">
            <Link href={slide.handle ? `/product/${slide.handle}` : "#"} className="block h-full w-full">
              <img
                src={slide.url}
                alt={`Imagen de banner JBL ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Prev / Next arrows — solo si hay más de 1 slide */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-3 top-1/2 z-40 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2.5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 opacity-0 group-hover:opacity-100 md:left-5 md:p-3"
            aria-label="Imagen anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-3 top-1/2 z-40 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2.5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 opacity-0 group-hover:opacity-100 md:right-5 md:p-3"
            aria-label="Siguiente imagen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot / progress indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center space-x-2 rounded-full bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm md:bottom-6 md:space-x-3 md:px-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-2 cursor-pointer overflow-hidden rounded-full transition-all duration-500 md:h-2.5 ${
                index === currentIndex
                  ? "w-8 bg-gray-300 md:w-16"
                  : "w-2 bg-gray-300 hover:bg-gray-400 md:w-2.5"
              }`}
              aria-label={`Ir a la imagen ${index + 1}`}
            >
              {index === currentIndex && (
                <span
                  className="absolute top-0 left-0 h-full rounded-full bg-gray-800"
                  style={{
                    width: isMobile ? "100%" : `${progress}%`,
                    transition: "width 50ms linear",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Cursor badge */}
      <span
        ref={badgeRef}
        className="pointer-events-none fixed top-1 left-0 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-bold tracking-widest text-black uppercase opacity-0 shadow-2xl transition-opacity duration-200 ease-out will-change-transform group-hover:opacity-100"
      >
        Ver Producto
      </span>
    </section>
  );
};
