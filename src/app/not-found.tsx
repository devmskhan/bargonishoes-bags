import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap centered">
      <div style={{ textAlign: "center", display: "grid", gap: 20, justifyItems: "center" }}>
        <span className="eyebrow">404</span>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)" }}>That piece has moved on</h1>
        <p className="note" style={{ fontSize: 15, maxWidth: "40ch" }}>
          The page you were after is not here. The collection changes often — have
          a look at what is on the floor now.
        </p>
        <Link href="/shop" className="btn btn-gold">
          View the collection
        </Link>
      </div>
    </div>
  );
}
