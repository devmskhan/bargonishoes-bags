"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SHOP, money, waLink } from "@/lib/shop";
import { useCart, lineKey, productOf } from "./CartProvider";
import ProductMedia from "./ProductMedia";

type Placed = { text: string; url: string; ref: string };

export default function CheckoutForm({
  defaultName = "",
  defaultEmail = ""
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const { lines, subtotal, ready, clear } = useCart();

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [noteText, setNoteText] = useState("");
  const [deliveryId, setDeliveryId] = useState(SHOP.delivery[1].id);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [copied, setCopied] = useState(false);

  const delivery = useMemo(
    () => SHOP.delivery.find((d) => d.id === deliveryId) ?? SHOP.delivery[0],
    [deliveryId]
  );

  const needsAddress = delivery.id !== "pickup";
  const total = subtotal + delivery.fee;

  function place() {
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (phone.replace(/\D/g, "").length < 10)
      return setError("Please enter a phone number we can reach you on.");
    if (needsAddress && address.trim().length < 6)
      return setError("Please enter the address we should deliver to.");

    setError(null);

    const ref =
      "BG-" +
      new Date().toISOString().slice(2, 10).replace(/-/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    const items = lines.map((l) => {
      const p = productOf(l.slug);
      if (!p) return "";
      const meta = [l.size ? `size ${l.size}` : "", l.color]
        .filter(Boolean)
        .join(", ");
      return `• ${l.qty} × ${p.brand} ${p.name}${meta ? ` (${meta})` : ""} — ${money(
        p.price * l.qty
      )}`;
    });

    const who = [
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      needsAddress ? `Address: ${address.trim()}` : null,
      noteText.trim() ? `Note: ${noteText.trim()}` : null
    ].filter(Boolean);

    const text = [
      `NEW ORDER — ${SHOP.legalName}`,
      items.join("\n"),
      [
        `Subtotal: ${money(subtotal)}`,
        `${delivery.label}: ${delivery.fee ? money(delivery.fee) : "Free"}`,
        `Total: ${money(total)}`
      ].join("\n"),
      who.join("\n"),
      `Ref: ${ref}`
    ].join("\n\n");

    setPlaced({ text, url: waLink(text), ref });
    clear();
  }

  function copy(text: string) {
    const mark = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    };
    try {
      navigator.clipboard.writeText(text).then(mark, mark);
    } catch {
      mark();
    }
  }

  /* ---------- after placing ---------- */

  if (placed) {
    return (
      <div className="wrap" style={{ paddingBlock: "clamp(40px, 6vw, 80px)", maxWidth: 720 }}>
        <div className="done">
          <div className="done-seal" aria-hidden="true">
            &#10003;
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>Your order is ready to send</h1>
          <p className="note" style={{ fontSize: 15 }}>
            Send it to us on WhatsApp and we will reply to confirm the piece, the
            total and your delivery. Nothing is charged until we have spoken.
          </p>
          <p className="note">
            Your reference: <span className="num" style={{ color: "var(--gold-bright)" }}>{placed.ref}</span>
          </p>

          <pre className="order-slip">{placed.text}</pre>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%" }}>
            <a
              href={placed.url}
              className="btn btn-gold"
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: "1 1 220px" }}
            >
              Send on WhatsApp
            </a>
            <button
              className="btn btn-line"
              onClick={() => copy(placed.text)}
              style={{ flex: "1 1 160px" }}
            >
              {copied ? "Copied" : "Copy order"}
            </button>
          </div>

          <p className="note">
            If WhatsApp does not open, copy the order above and send it to{" "}
            {SHOP.phones.join(" or ")}, or email {SHOP.email}.
          </p>

          <Link href="/shop" className="back-link">
            &larr; Back to the collection
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- empty ---------- */

  if (ready && lines.length === 0) {
    return (
      <div className="wrap centered">
        <div style={{ textAlign: "center", display: "grid", gap: 20, justifyItems: "center" }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>Your bag is empty</h1>
          <p className="note" style={{ fontSize: 15, maxWidth: "38ch" }}>
            Add a piece from the collection and it will show up here.
          </p>
          <Link href="/shop" className="btn btn-gold">
            View the collection
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- the form ---------- */

  return (
    <div className="wrap">
      <div className="section-head" style={{ marginBottom: 0, paddingTop: "clamp(28px, 4vw, 48px)" }}>
        <div>
          <span className="eyebrow">Checkout</span>
          <h2>Where is it going?</h2>
        </div>
      </div>

      <div className="checkout">
        <div className="checkout-form">
          <div className="two-fields">
            <div className="field">
              <label htmlFor="co-name">Full name</label>
              <input
                id="co-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Musa Ibrahim"
              />
            </div>
            <div className="field">
              <label htmlFor="co-phone">Phone number</label>
              <input
                id="co-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0803 123 4567"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="co-email">Email (optional)</label>
            <input
              id="co-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="co-delivery">How would you like it?</label>
            <select
              id="co-delivery"
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
            >
              {SHOP.delivery.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} — {d.fee ? money(d.fee) : "free"}
                </option>
              ))}
            </select>
          </div>

          {needsAddress ? (
            <div className="field">
              <label htmlFor="co-address">Delivery address</label>
              <textarea
                id="co-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, area, nearest landmark, city"
              />
            </div>
          ) : (
            <p className="note">
              Collect from {SHOP.address.street}, {SHOP.address.city}. We are open{" "}
              {SHOP.hours}.
            </p>
          )}

          <div className="field">
            <label htmlFor="co-note">Anything else (optional)</label>
            <textarea
              id="co-note"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="A second colour if the first has gone, gift wrapping, a delivery day that suits you…"
            />
          </div>

          {error ? <p className="err">{error}</p> : null}

          <button className="btn btn-gold btn-block" onClick={place}>
            Place order
          </button>

          <p className="note">
            Placing the order sends it to us on WhatsApp. We confirm availability
            and the total before you pay — by transfer, cash or POS.
          </p>
        </div>

        <aside className="panel summary">
          <h3 style={{ fontSize: 22, marginBottom: 20 }}>Your bag</h3>

          {lines.map((l) => {
            const p = productOf(l.slug);
            if (!p) return null;
            const meta = [l.size ? `Size ${l.size}` : "", l.color]
              .filter(Boolean)
              .join(" · ");
            return (
              <div className="line" key={lineKey(l)}>
                <div className="line-media">
                  <ProductMedia product={p} />
                </div>
                <div>
                  <span className="line-brand">{p.brand}</span>
                  <div className="line-name">{p.name}</div>
                  {meta ? <div className="line-meta">{meta}</div> : null}
                  <div className="line-meta num">Qty {l.qty}</div>
                </div>
                <div className="line-cost num">{money(p.price * l.qty)}</div>
              </div>
            );
          })}

          <div className="totals" style={{ marginTop: 20 }}>
            <div>
              <span>Subtotal</span>
              <span className="num">{money(subtotal)}</span>
            </div>
            <div>
              <span>{delivery.label}</span>
              <span className="num">{delivery.fee ? money(delivery.fee) : "Free"}</span>
            </div>
            <div className="grand">
              <span>Total</span>
              <span className="num">{money(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
