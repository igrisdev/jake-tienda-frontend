import { getCollectionCategoriesAndBrands } from "@/lib/shopify";
import { CarouselBrands } from "./carousel-brands";
import { MAIN_MENU } from "@/lib/constants";

export const Brands = async () => {
  const { brands } = await getCollectionCategoriesAndBrands(MAIN_MENU);

  return <CarouselBrands brands={brands} />;
};
