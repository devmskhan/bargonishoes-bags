import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, SHOP, getProduct, money, waLink } from "@/lib/shop";
import ProductMedia from "@/components/ProductMedia";
import AddToBag from "@/components/AddToBag";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.brand} ${product.name}`,
    description: `${product.brand} ${product.name} — ${product.blurb}. ${money(
      product.price
    )} at Bargoni, Zoo Road, Kano.`
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const enquiry = waLink(
    `Hello ${SHOP.name}, I am interested in the ${product.brand} ${product.name} (${money(
      product.price
    )}). Is it still available?`
  );

  return (
    <div className="wrap">
      <div className="pdp">
        <div className="pdp-media">
          {product.tag ? <span className="badge">{product.tag}</span> : null}
          <span className="cond">{product.condition}</span>
          <ProductMedia product={product} priority />
        </div>

        <div className="pdp-side">
          <div>
            <span className="pcard-brand">{product.brand}</span>
            <h1 style={{ marginTop: 10 }}>{product.name}</h1>
          </div>

          <div className="pdp-price">
            <span className="price num">{money(product.price)}</span>
            {product.was ? (
              <span className="price-was num">{money(product.was)}</span>
            ) : null}
          </div>

          <p className="pdp-detail">{product.detail}</p>

          <AddToBag product={product} />

          <a
            href={enquiry}
            className="btn btn-line btn-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask about this piece
          </a>

          <ul className="spec">
            <li>
              <span className="k">House</span>
              <span className="v">{product.brand}</span>
            </li>
            <li>
              <span className="k">Condition</span>
              <span className="v">{product.condition}</span>
            </li>
            <li>
              <span className="k">Type</span>
              <span className="v">
                {product.category === "shoes" ? "Footwear" : "Bag"}
              </span>
            </li>
            {product.sizes.length > 0 ? (
              <li>
                <span className="k">Sizes here</span>
                <span className="v num">{product.sizes.join(", ")}</span>
              </li>
            ) : null}
            <li>
              <span className="k">Collect</span>
              <span className="v">
                {SHOP.address.street}, {SHOP.address.city}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <Link href="/shop" className="back-link">
        &larr; Back to the collection
      </Link>
    </div>
  );
}
