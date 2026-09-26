"use client";

import Link from "next/link";
import { useEffect } from "react";
import { money } from "@/lib/shop";
import { useCart, lineKey, productOf } from "./CartProvider";
import ProductMedia from "./ProductMedia";

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove, toast } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      {toast ? <div className="toast" role="status">{toast}</div> : null}

      {open ? (
        <>
          <div className="scrim" onClick={() => setOpen(false)} />
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your selection">
            <div className="drawer-head">
              <h2>Your selection</h2>
              <button className="x" onClick={() => setOpen(false)} aria-label="Close">
                &times;
              </button>
            </div>

            <div className="drawer-body">
              {lines.length === 0 ? (
                <p className="note" style={{ fontSize: 15 }}>
                  Nothing selected yet. Browse the collection and add a piece.
                </p>
              ) : (
                lines.map((l) => {
                  const p = productOf(l.slug);
                  if (!p) return null;
                  const key = lineKey(l);
                  const meta = [l.size ? `Size ${l.size}` : "", l.color]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <div className="line" key={key}>
                      <div className="line-media">
                        <ProductMedia product={p} />
                      </div>
                      <div>
                        <span className="line-brand">{p.brand}</span>
                        <div className="line-name">{p.name}</div>
                        {meta ? <div className="line-meta">{meta}</div> : null}
                        <div className="qty">
                          <button onClick={() => setQty(key, -1)} aria-label="Reduce quantity">
                            &minus;
                          </button>
                          <span>{l.qty}</span>
                          <button onClick={() => setQty(key, 1)} aria-label="Increase quantity">
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="line-cost num">{money(p.price * l.qty)}</div>
                        <button className="drop" onClick={() => remove(key)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="drawer-foot">
              {lines.length > 0 ? (
                <>
                  <div className="totals">
                    <div>
                      <span>Subtotal</span>
                      <span className="num">{money(subtotal)}</span>
                    </div>
                    <div>
                      <span>Delivery</span>
                      <span>Chosen at checkout</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="btn btn-gold btn-block"
                    onClick={() => setOpen(false)}
                  >
                    Proceed to checkout
                  </Link>
                </>
              ) : null}
              <button className="btn btn-line btn-block" onClick={() => setOpen(false)}>
                Continue browsing
              </button>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
