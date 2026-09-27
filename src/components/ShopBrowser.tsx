"use client";

import { useMemo, useState } from "react";
import {
  activeBrands,
  activeCategories,
  categoryLabel,
  type Category
} from "@/lib/shop";
import type { StoredProduct } from "@/lib/catalogue";
import ProductCard from "./ProductCard";

type CategoryFilter = Category | "all";

export default function ShopBrowser({
  products,
  initialCategory = "all",
  initialBrand = "all"
}: {
  products: StoredProduct[];
  initialCategory?: CategoryFilter;
  initialBrand?: string;
}) {
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [brand, setBrand] = useState<string>(initialBrand);

  /* only show filters that have stock behind them */
  const categories = useMemo(() => activeCategories(products), [products]);
  const brands = useMemo(() => activeBrands(products), [products]);

  const items = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (brand === "all" || p.brand === brand)
      ),
    [products, category, brand]
  );

  return (
    <>
      {categories.length > 1 ? (
        <div className="filters" role="group" aria-label="Filter by type">
          <button
            className="filter"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            Everything
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className="filter"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {categoryLabel(c)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="filters" role="group" aria-label="Filter by house">
        <button
          className="filter"
          aria-pressed={brand === "all"}
          onClick={() => setBrand("all")}
        >
          All houses
        </button>
        {brands.map((b) => (
          <button
            key={b}
            className="filter"
            aria-pressed={brand === b}
            onClick={() => setBrand(b)}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="grid">
        {items.length === 0 ? (
          <p className="empty">
            Nothing in stock under that combination right now. Message us — we
            source to order.
          </p>
        ) : (
          items.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))
        )}
      </div>
    </>
  );
}
