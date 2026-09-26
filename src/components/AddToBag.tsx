"use client";

import { useState } from "react";
import type { Product } from "@/lib/shop";
import { useCart } from "./CartProvider";

export default function AddToBag({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [size, setSize] = useState<string>(
    product.sizes.length ? String(product.sizes[0]) : ""
  );
  const [color, setColor] = useState<string>(product.colors[0] ?? "");

  return (
    <>
      {product.sizes.length > 0 ? (
        <div className="opt">
          <span className="opt-label">Size (EU)</span>
          <div className="chips">
            {product.sizes.map((s) => (
              <button
                key={String(s)}
                className="chip"
                aria-pressed={size === String(s)}
                onClick={() => setSize(String(s))}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {product.colors.length > 0 ? (
        <div className="opt">
          <span className="opt-label">Colour</span>
          <div className="chips">
            {product.colors.map((c) => (
              <button
                key={c}
                className="chip"
                aria-pressed={color === c}
                onClick={() => setColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <button
        className="btn btn-gold btn-block"
        onClick={() => {
          add(product.slug, size, color);
          setOpen(true);
        }}
      >
        Add to bag
      </button>
    </>
  );
}
