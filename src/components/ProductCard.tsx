import Link from "next/link";
import type { Product } from "@/lib/shop";
import ProductMedia from "./ProductMedia";

export default function ProductCard({
  product,
  priority = false
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link href={`/product/${product.slug}`} className="pcard">
      <div className="pcard-media">
        {product.tag ? <span className="badge">{product.tag}</span> : null}
        <ProductMedia product={product} priority={priority} />
      </div>
      <div className="pcard-body">
        <span className="pcard-brand">{product.brand}</span>
        <h3 className="pcard-name">{product.name}</h3>
        <p className="pcard-blurb">{product.blurb}</p>
        <div className="pcard-foot">
          <span className="ask">View &amp; enquire</span>
          {product.sizes.length > 0 ? (
            <span className="sizes num">
              EU {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
