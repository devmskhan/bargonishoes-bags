import { isAdmin, denied } from "@/lib/admin";
import {
  getCatalogue,
  saveCatalogue,
  blobConfigured,
  makeId,
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

/** Everything, hidden pieces included. */
export async function GET() {
  if (!(await isAdmin())) return denied();
  return Response.json({ products: await getCatalogue() });
}

/** Add a piece. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return denied();
  if (!blobConfigured()) {
    return Response.json(
      { error: "Storage is not set up yet. Add BLOB_READ_WRITE_TOKEN." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Could not read that." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const brand = String(body.brand ?? "").trim();
  if (!name) return Response.json({ error: "A name is required." }, { status: 400 });
  if (!brand) return Response.json({ error: "A house is required." }, { status: 400 });

  const category: Category = body.category === "bags" ? "bags" : "shoes";
  const items = await getCatalogue();

  const product: StoredProduct = {
    id: makeId(),
    slug: uniqueSlug(slugify(`${brand}-${name}`), items),
    name,
    brand,
    category,
    blurb: String(body.blurb ?? "").trim(),
    detail: String(body.detail ?? "").trim(),
    sizes: asList(body.sizes).map((s) => (/^\d+$/.test(s) ? Number(s) : s)),
    colors: asList(body.colors),
    image: String(body.image ?? "").trim() || undefined,
    tag: String(body.tag ?? "").trim() || undefined,
    hidden: Boolean(body.hidden),
    updatedAt: new Date().toISOString()
  };

  await saveCatalogue([product, ...items]);
  return Response.json({ product }, { status: 201 });
}
