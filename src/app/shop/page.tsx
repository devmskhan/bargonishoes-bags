import type { Metadata } from "next";
import { BRANDS, type Category } from "@/lib/shop";
import ShopBrowser from "@/components/ShopBrowser";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "Designer shoes and bags in stock at Bargoni, Zoo Road, Kano — Gucci, Ferragamo, Hermès, Prada and more."
};

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ c?: string; b?: string }>;
}) {
  const sp = await searchParams;

  const category: Category | "all" =
    sp.c === "shoes" || sp.c === "bags" ? sp.c : "all";

  const brand =
    sp.b && (BRANDS as readonly string[]).includes(sp.b) ? sp.b : "all";

  return (
    <section className="section wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">In store now</span>
          <h2>The collection</h2>
          <p className="sub">
            What is on the floor at Zoo Road today. Prices are in naira and
            include the piece as photographed. Message us to hold a size.
          </p>
        </div>
      </div>

      <ShopBrowser initialCategory={category} initialBrand={brand} />
    </section>
  );
}
