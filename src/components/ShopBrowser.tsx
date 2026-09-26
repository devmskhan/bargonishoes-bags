"use client";

import { useMemo, useState } from "react";
import { BRANDS, PRODUCTS, type Category } from "@/lib/shop";
import ProductCard from "./ProductCard";

type CategoryFilter = Category | "all";

export default function ShopBrowser({
  initialCategory = "all",
  initialBrand = "all"
}: {
  initialCategory?: CategoryFilter;
  initialBrand?: string;
}) {
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [brand, setBrand] = useState<string>(initialBrand);

  const items = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (brand === "all" || p.brand === brand)
      ),
    [category, brand]
  );

  return (
    <>
      <div className="filters" role="group" aria-label="Filter by type">
        {(
          [
            ["all", "Everything"],
            ["shoes", "Shoes"],
            ["bags", "Bags"]
          ] as [CategoryFilter, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            className="filter"
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="filters" role="group" aria-label="Filter by house">
        <button
          className="filter"
          aria-pressed={brand === "all"}
          onClick={() => setBrand("all")}
        >
          All houses
        </button>
        {BRANDS.map((b) => (
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
