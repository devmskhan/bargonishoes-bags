import type { Product } from "@/lib/shop";

/* Shows the product photo when one exists, otherwise a lettered gold plate
   so the grid still reads as designed. Add photos to public/products/ and
   set `image` on the product in src/lib/shop.ts. */
export default function ProductMedia({
  product,
  priority = false
}: {
  product: Product;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={product.image}
        alt={`${product.brand} ${product.name}`}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <div className="plate" aria-hidden="true">
      <span className="plate-letter">{product.brand.charAt(0)}</span>
    </div>
  );
}
