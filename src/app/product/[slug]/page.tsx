import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SHOP, getProduct, categoryLabel, waLink } from "@/lib/shop";
import { getVisibleCatalogue } from "@/lib/catalogue";
import ProductMedia from "@/components/ProductMedia";
import AddToBag from "@/components/AddToBag";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(await getVisibleCatalogue(), slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.brand} ${product.name}`,
    description: `${product.brand} ${product.name} — ${product.blurb}. In store at Bargoni, Zoo Road, Kano.`
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(await getVisibleCatalogue(), slug);
  if (!product) notFound();

  const enquiry = waLink(
    `Hello ${SHOP.name}, please send me the price for the ${product.brand} ${product.name}. Is it available?`
  );

  return (
    <div className="wrap">
      <div className="pdp">
        <div className="pdp-media">
          {product.tag ? <span className="badge">{product.tag}</span> : null}
          <ProductMedia product={product} priority />
        </div>

        <div className="pdp-side">
          <div>
            <span className="pcard-brand">{product.brand}</span>
            <h1 style={{ marginTop: 10 }}>{product.name}</h1>
          </div>

          <p className="pdp-detail">{product.detail}</p>

          <p className="price-ask">
            Price on request — we confirm it with you before anything is agreed.
          </p>

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
              <span className="k">Type</span>
              <span className="v">{categoryLabel(product.category)}</span>
            </li>
            {product.sizes.length > 0 ? (
              <li>
                <span className="k">Sizes here</span>
                <span className="v num">EU {product.sizes.join(", ")}</span>
              </li>
            ) : null}
            {product.colors.length > 0 ? (
              <li>
                <span className="k">Colours</span>
                <span className="v">{product.colors.join(", ")}</span>
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
