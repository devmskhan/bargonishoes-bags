import Link from "next/link";
import { SHOP, fullAddress, waLink } from "@/lib/shop";
import { isAdmin } from "@/lib/admin";

export const metadata = { title: "Your account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!clerkEnabled) {
    return (
      <div className="wrap centered">
        <div style={{ maxWidth: 560, display: "grid", gap: 16 }}>
          <span className="eyebrow">Accounts</span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>Sign-in is not switched on yet</h1>
          <p className="note" style={{ fontSize: 15 }}>
            Add your Clerk keys to <code>.env.local</code> and restart the site.
            The README has the two lines you need. Ordering works without this —
            accounts only add saved details and a faster checkout.
          </p>
          <Link href="/shop" className="btn btn-line" style={{ justifySelf: "start" }}>
            View the collection
          </Link>
        </div>
      </div>
    );
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();
  const admin = await isAdmin();

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <section className="section wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">Your account</span>
          <h2>{name ? `Welcome, ${name}` : "Welcome"}</h2>
          <p className="sub">
            Your details are filled in at checkout so you do not have to type
            them each time.
          </p>
        </div>
      </div>

      {admin ? (
        <div className="panel" style={{ marginBottom: 24 }}>
          <h3>Manage the collection</h3>
          <p style={{ marginTop: 8 }}>
            Add, edit, hide or remove pieces. Changes show on the site
            immediately.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link href="/admin" className="btn btn-gold">
              Open the admin dashboard
            </Link>
          </div>
        </div>
      ) : null}

      <div className="duo">
        <div className="panel">
          <h3>Your details</h3>
          <ul className="spec" style={{ marginTop: 20 }}>
            <li>
              <span className="k">Name</span>
              <span className="v">{name || "Not set"}</span>
            </li>
            <li>
              <span className="k">Email</span>
              <span className="v">{email || "Not set"}</span>
            </li>
          </ul>
          <p className="note" style={{ marginTop: 18 }}>
            Change these from the avatar menu at the top of the page.
          </p>
        </div>

        <div className="panel">
          <h3>Your orders</h3>
          <p style={{ marginTop: 8 }}>
            Orders are confirmed on WhatsApp, so the full history lives in that
            conversation with us. Quote your <strong>BG-</strong> reference and
            we will pull up the order straight away.
          </p>
          <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
            <a
              href={waLink(`Hello ${SHOP.name}, I would like to check on an order.`)}
              className="btn btn-gold btn-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check an order on WhatsApp
            </a>
            <Link href="/shop" className="btn btn-line btn-block">
              Browse the collection
            </Link>
          </div>
          <p className="note" style={{ marginTop: 18 }}>
            Collection point: {fullAddress()}. Open {SHOP.hours}.
          </p>
        </div>
      </div>
    </section>
  );
}
