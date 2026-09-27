import Link from "next/link";
import { isAdmin, adminConfigured, signedInEmail, clerkConfigured } from "@/lib/admin";
import { getCatalogue, blobConfigured } from "@/lib/catalogue";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  /* Not set up yet — say which half is missing rather than a blank refusal. */
  if (!adminConfigured()) {
    return (
      <div className="wrap centered">
        <div style={{ maxWidth: 580, display: "grid", gap: 16 }}>
          <span className="eyebrow">Admin</span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>Not set up yet</h1>
          <p className="note" style={{ fontSize: 15 }}>
            {clerkConfigured()
              ? "Clerk is connected, but ADMIN_EMAIL is not set. Add it in Vercel and redeploy."
              : "Add your Clerk keys and ADMIN_EMAIL in Vercel, then redeploy. The README has the steps."}
          </p>
          <Link href="/" className="btn btn-line" style={{ justifySelf: "start" }}>
            Back to the site
          </Link>
        </div>
      </div>
    );
  }

  const email = await signedInEmail();

  /* Signed out: send them to sign in and come back here. */
  if (!email) {
    return (
      <div className="wrap centered">
        <div style={{ maxWidth: 520, display: "grid", gap: 16 }}>
          <span className="eyebrow">Admin</span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>Sign in to continue</h1>
          <p className="note" style={{ fontSize: 15 }}>
            This area is for the shop only.
          </p>
          <Link
            href="/sign-in?redirect_url=/admin"
            className="btn btn-gold"
            style={{ justifySelf: "start" }}
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  /* Signed in as somebody else: refuse without hinting at who may enter. */
  if (!(await isAdmin())) {
    return (
      <div className="wrap centered">
        <div style={{ maxWidth: 520, display: "grid", gap: 16 }}>
          <span className="eyebrow">Admin</span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>No access</h1>
          <p className="note" style={{ fontSize: 15 }}>
            This account cannot manage the collection.
          </p>
          <Link href="/" className="btn btn-line" style={{ justifySelf: "start" }}>
            Back to the site
          </Link>
        </div>
      </div>
    );
  }

  const products = await getCatalogue();
  return <AdminDashboard initial={products} storageReady={blobConfigured()} />;
}
