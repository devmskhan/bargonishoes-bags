/* ============================================================
   The live catalogue.

   Products are stored as one JSON file in Vercel Blob so the admin
   can add and remove them without touching the code. The products in
   src/lib/shop.ts are the seed: they are written to Blob the first
   time the site runs with a Blob token, and after that the stored
   copy is the source of truth.

   With no Blob token configured, every read falls back to the seed,
   so the public site keeps working exactly as it does today and only
   the admin's saving is unavailable.
   ============================================================ */

import { put, list } from "@vercel/blob";
import { SEED_PRODUCTS, type Product } from "./shop";

export type StoredProduct = Product & {
  id: string;
  hidden?: boolean;
  updatedAt?: string;
};

const FILE = "catalogue.json";

const clean = (v: string | undefined) =>
  (v ?? "").trim().replace(/^["']|["']$/g, "").trim();

/* Vercel injects BLOB_READ_WRITE_TOKEN when a Blob store is connected, but a
   store connected under its own name arrives as <STORE>_READ_WRITE_TOKEN
   instead. Accept either, and strip the quotes people carry over from the
   .env form of the line. */
export function blobTokenSource(): { name: string; token: string } {
  const direct = clean(process.env.BLOB_READ_WRITE_TOKEN);
  if (direct) return { name: "BLOB_READ_WRITE_TOKEN", token: direct };

  for (const [name, value] of Object.entries(process.env)) {
    if (!name.endsWith("_READ_WRITE_TOKEN")) continue;
    const token = clean(value);
    if (token.startsWith("vercel_blob_rw_")) return { name, token };
  }

  return { name: "", token: "" };
}

export function blobToken(): string {
  return blobTokenSource().token;
}

export const blobConfigured = () => blobToken().length > 0;

const fromSeed = (): StoredProduct[] =>
  SEED_PRODUCTS.map((p) => ({ ...p, id: p.slug }));

/** Everything, including pieces the admin has hidden. Admin views only. */
export async function getCatalogue(): Promise<StoredProduct[]> {
  if (!blobConfigured()) return fromSeed();

  try {
    const { blobs } = await list({ prefix: FILE, limit: 100, token: blobToken() });
    const hit = blobs.find((b) => b.pathname === FILE);

    if (!hit) {
      const seeded = fromSeed();
      await saveCatalogue(seeded);
      return seeded;
    }

    const res = await fetch(hit.url, { cache: "no-store" });
    if (!res.ok) return fromSeed();

    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return fromSeed();

    return (data as StoredProduct[]).filter(
      (p) => p && typeof p.slug === "string" && typeof p.name === "string"
    );
  } catch {
    /* Blob unreachable — show the seed rather than an empty shop */
    return fromSeed();
  }
}

/** What the public site shows. */
export async function getVisibleCatalogue(): Promise<StoredProduct[]> {
  const all = await getCatalogue();
  return all.filter((p) => !p.hidden);
}

/* Older @vercel/blob overwrites a fixed pathname by default and has no
   `allowOverwrite` option; newer versions require it and refuse without.
   Passing it through a loose cast satisfies the compiler on both, and the
   older SDK simply ignores the extra key. */
type PutOptions = Parameters<typeof put>[2];

export async function saveCatalogue(items: StoredProduct[]): Promise<void> {
  const options = {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    token: blobToken()
  } as unknown as PutOptions;

  await put(FILE, JSON.stringify(items, null, 2), options);
}

/* ---------- helpers used by the API routes ---------- */

export const makeId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "piece"
  );
}

/** Keeps slugs unique, since the slug is the product's URL. */
export function uniqueSlug(
  base: string,
  items: StoredProduct[],
  ignoreId?: string
): string {
  const taken = new Set(
    items.filter((p) => p.id !== ignoreId).map((p) => p.slug)
  );
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}
