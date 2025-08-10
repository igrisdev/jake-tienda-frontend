import { IProductFilter, IViewProduct } from "@/types/product";
import ProductInfo from "./product-info";
import ProductSimilar from "./product-similar";
import { getViewProduct } from "@/service/api/product";
import ProductCarousel from "./product-carousel";
import ProductDetails from "./product-details";
import { productCategory } from "@/service/api/category";

export const ProductDetail = async ({ slug }: { slug: string }) => {
  if (!slug) {
    return <div>Producto no encontrado.</div>;
  }

  const product = (await getViewProduct(slug)) as IViewProduct;

  if (!product) {
    return <div>Producto no encontrado.</div>;
  }

  let categoryProducts: IProductFilter[] = [];
  if (product.category) {
    categoryProducts = await productCategory(product.category, product.id);
  }

  return (
    <div className="animate-fade animate-once animate-duration-[600ms] animate-ease-in-out mx-auto max-w-7xl space-y-16 px-6 py-10 lg:px-20">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <ProductCarousel images={product.images} />
        <ProductInfo
          id={product.id}
          image={product.images[0]}
          name={product.name}
          price={product.price}
          stock={product.stock}
        />
      </div>

      {product.description && (
        <ProductDetails description={product.description} />
      )}

      {categoryProducts.length > 0 && (
        <ProductSimilar products={categoryProducts} />
      )}
    </div>
  );
};
