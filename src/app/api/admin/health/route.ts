import { isAdmin, denied, adminEmail, signedInEmail } from "@/lib/admin";
import { blobConfigured, blobToken, getCatalogue } from "@/lib/catalogue";

export const dynamic = "force-dynamic";

/* A setup report for the admin. Says what this deployment can actually
   see, never the values themselves. */
export async function GET() {
  if (!(await isAdmin())) return denied();

  const raw = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  const clean = blobToken();

  let storage: Record<string, unknown> = {
    tokenVisible: clean.length > 0,
    tokenLength: clean.length,
    looksLikeAVercelBlobToken: clean.startsWith("vercel_blob_rw_"),
    hadStrayQuotes: raw.trim() !== clean
  };

  if (blobConfigured()) {
    try {
      const items = await getCatalogue();
      storage = { ...storage, reachable: true, productsStored: items.length };
    } catch (e) {
      storage = {
        ...storage,
        reachable: false,
        error: e instanceof Error ? e.message : String(e)
      };
    }
  }

  return Response.json({
    deployment: {
      environment: process.env.VERCEL_ENV ?? "not on Vercel",
      url: process.env.VERCEL_URL ?? null
    },
    signIn: {
      clerkPublishableKeyVisible: Boolean(
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      ),
      clerkSecretKeyVisible: Boolean(process.env.CLERK_SECRET_KEY),
      adminEmailVisible: adminEmail().length > 0,
      signedInAs: await signedInEmail(),
      matchesAdminEmail: true
    },
    storage
  });
}
