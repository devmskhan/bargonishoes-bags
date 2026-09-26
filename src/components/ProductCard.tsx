import Link from "next/link";
import { money, type Product } from "@/lib/shop";
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
        <span className="cond">{product.condition}</span>
        <ProductMedia product={product} priority={priority} />
      </div>
      <div className="pcard-body">
        <span className="pcard-brand">{product.brand}</span>
        <h3 className="pcard-name">{product.name}</h3>
        <p className="pcard-blurb">{product.blurb}</p>
        <div className="pcard-foot">
          <span className="price num">{money(product.price)}</span>
          {product.was ? (
            <span className="price-was num">{money(product.was)}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
