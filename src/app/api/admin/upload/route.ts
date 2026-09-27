import { put } from "@vercel/blob";
import { isAdmin, denied } from "@/lib/admin";
import { blobConfigured, slugify } from "@/lib/catalogue";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: Request) {
  if (!(await isAdmin())) return denied();
  if (!blobConfigured()) {
    return Response.json(
      { error: "Storage is not set up yet. Add BLOB_READ_WRITE_TOKEN." },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Choose a photo first." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return Response.json(
      { error: "Use a JPEG, PNG or WebP photo." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "That photo is over 8 MB. Export it smaller and try again." },
      { status: 400 }
    );
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "photo";

  const blob = await put(`products/${Date.now()}-${base}.${ext}`, file, {
    access: "public",
    contentType: file.type
  });

  return Response.json({ url: blob.url });
}
