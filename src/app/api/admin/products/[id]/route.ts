import { isAdmin, denied } from "@/lib/admin";
import {
  getCatalogue,
  saveCatalogue,
  blobConfigured,
  slugify,
  uniqueSlug,
  type StoredProduct
} from "@/lib/catalogue";
import type { Category } from "@/lib/shop";

export const dynamic = "force-dynamic";

const asList = (v: unknown): string[] =>
  typeof v === "string"
    ? v.split(",").map((x) => x.trim()).filter(Boolean)
    : Array.isArray(v)
      ? v.map((x) => String(x).trim()).filter(Boolean)
      : [];

const noStore = () =>
  Response.json(
    { error: "Storage is not set up yet. Add BLOB_READ_WRITE_TOKEN." },
    { status: 503 }
  );

/** Edit a piece, or show/hide it. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return denied();
  if (!blobConfigured()) return noStore();

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Could not read that." }, { status: 400 });
  }

  const items = await getCatalogue();
  const index = items.findIndex((p) => p.id === id);
  if (index === -1) {
    return Response.json({ error: "That piece is no longer here." }, { status: 404 });
  }

  const current = items[index];
  const name = body.name === undefined ? current.name : String(body.name).trim();
  const brand = body.brand === undefined ? current.brand : String(body.brand).trim();
  if (!name || !brand) {
    return Response.json({ error: "Name and house are both required." }, { status: 400 });
  }

  const renamed = name !== current.name || brand !== current.brand;

  const updated: StoredProduct = {
    ...current,
    name,
    brand,
    slug: renamed
      ? uniqueSlug(slugify(`${brand}-${name}`), items, current.id)
      : current.slug,
    category:
      body.category === undefined
        ? current.category
        : ((body.category === "bags" ? "bags" : "shoes") as Category),
    blurb: body.blurb === undefined ? current.blurb : String(body.blurb).trim(),
    detail: body.detail === undefined ? current.detail : String(body.detail).trim(),
    sizes:
      body.sizes === undefined
        ? current.sizes
        : asList(body.sizes).map((s) => (/^\d+$/.test(s) ? Number(s) : s)),
    colors: body.colors === undefined ? current.colors : asList(body.colors),
    image:
      body.image === undefined
        ? current.image
        : String(body.image).trim() || undefined,
    tag:
      body.tag === undefined ? current.tag : String(body.tag).trim() || undefined,
    hidden: body.hidden === undefined ? current.hidden : Boolean(body.hidden),
    updatedAt: new Date().toISOString()
  };

  items[index] = updated;
  await saveCatalogue(items);
  return Response.json({ product: updated });
}

/** Remove a piece for good. */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return denied();
  if (!blobConfigured()) return noStore();

  const { id } = await params;
  const items = await getCatalogue();
  const remaining = items.filter((p) => p.id !== id);

  if (remaining.length === items.length) {
    return Response.json({ error: "That piece is no longer here." }, { status: 404 });
  }

  await saveCatalogue(remaining);
  return Response.json({ ok: true });
}
