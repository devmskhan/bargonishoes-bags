import type { Metadata } from "next";
import { activeBrands, type Category } from "@/lib/shop";
import ShopBrowser from "@/components/ShopBrowser";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "Designer shoes and bags in stock at Bargoni, Zoo Road, Kano — Hermès, Dior, Louis Vuitton, Loro Piana, Saint Laurent and more."
};

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ c?: string; b?: string }>;
}) {
  const sp = await searchParams;

  const category: Category | "all" =
    sp.c === "shoes" || sp.c === "bags" ? sp.c : "all";

  const brand = sp.b && activeBrands().includes(sp.b) ? sp.b : "all";

  return (
    <section className="section wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">In store now</span>
          <h2>The collection</h2>
          <p className="sub">
            What is on the floor at Zoo Road today. Prices are not listed —
            add what you like to your list and we send them straight back.
          </p>
        </div>
      </div>

      <ShopBrowser initialCategory={category} initialBrand={brand} />
    </section>
  );
}
