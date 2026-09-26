"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { PRODUCTS, type Product } from "@/lib/shop";

export type CartLine = {
  slug: string;
  size: string;
  color: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  ready: boolean;
  add: (slug: string, size: string, color: string) => void;
  setQty: (key: string, delta: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  toast: string | null;
};

const STORE_KEY = "bargoni.cart.v2";
const CartContext = createContext<CartState | null>(null);

export const lineKey = (l: CartLine) => `${l.slug}|${l.size}|${l.color}`;
export const productOf = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* load once on the client so server and first client render match */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          setLines(parsed.filter((l) => productOf(l.slug)));
        }
      }
    } catch {
      /* private window or storage blocked — the cart still works for this visit */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  /* lock the page behind the drawer */
  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.classList.remove("is-locked");
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const add = useCallback((slug: string, size: string, color: string) => {
    const product = productOf(slug);
    if (!product) return;
    setLines((prev) => {
      const candidate: CartLine = { slug, size, color, qty: 1 };
      const key = lineKey(candidate);
      const hit = prev.find((l) => lineKey(l) === key);
      if (hit) {
        return prev.map((l) => (lineKey(l) === key ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, candidate];
    });
    setToast(`${product.brand} ${product.name} added`);
  }, []);

  const setQty = useCallback((key: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((l) => (lineKey(l) === key ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => {
      const p = productOf(l.slug);
      return p ? n + p.price * l.qty : n;
    }, 0);
    return {
      lines,
      count,
      subtotal,
      open,
      ready,
      add,
      setQty,
      remove,
      clear,
      setOpen,
      toast
    };
  }, [lines, open, ready, add, setQty, remove, clear, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
