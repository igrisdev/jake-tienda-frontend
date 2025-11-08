"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "../grid/tile";
import { useProduct, useUpdateURL } from "./product-context";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export default function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const initialIndex = state.image ? parseInt(state.image) : 0;
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(false);

  const total = images.length;
  const next = index + 1 < total ? index + 1 : 0;
  const prev = index === 0 ? total - 1 : index - 1;

  const changeImage = (newIndex: number) => {
    setIsLoading(true);
    const newState = updateImage(newIndex.toString());
    updateURL(newState);
    setIndex(newIndex);
  };

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden cursor-zoom-in">
        {total ? (
          <img
            src={images[index].src}
            alt={images[index].altText}
            className="h-full w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => {
              setIsLoading(true);
              setIsOpen(true);
            }}
          />
        ) : (
          <img
            src="/not-found.png"
            alt="No image found"
            className="h-full w-full object-contain"
          />
        )}

        {total > 1 && (
          <div className="absolute bottom-[0.1%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur">
              <button
                type="button"
                onClick={() => changeImage(prev)}
                aria-label="Previous product image"
                className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black flex items-center justify-center"
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                type="button"
                onClick={() => changeImage(next)}
                aria-label="Next product image"
                className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black flex items-center justify-center"
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {total > 1 && (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-x-auto overflow-y-hidden py-1 lg:mb-0">
          {images.map((img, i) => (
            <li key={img.src} className="h-20 w-20">
              <button
                type="button"
                onClick={() => changeImage(i)}
                aria-label="Select product image"
                className="h-full w-full"
              >
                <GridTileImage
                  alt={img.altText}
                  src={img.src}
                  active={i === index}
                  width={80}
                  height={80}
                  style={{ height: "auto" }}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && (
        <Lightbox
          mainSrc={images[index].src}
          nextSrc={images[next]?.src}
          prevSrc={images[prev]?.src}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => changeImage(prev)}
          onMoveNextRequest={() => changeImage(next)}
          onImageLoad={() => setIsLoading(false)}
          onImageLoadError={() => setIsLoading(false)}
          enableZoom={false}
          animationDuration={250}
          imageCaption={undefined}
          reactModalStyle={{
            overlay: { backgroundColor: "rgba(0,0,0,0.9)" },
          }}
          
          toolbarButtons={[]}
        />
      )}

      {isOpen && isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </form>
  );
}
