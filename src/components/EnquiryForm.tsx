"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SHOP, waLink } from "@/lib/shop";
import { useCart, lineKey, productOf } from "./CartProvider";
import ProductMedia from "./ProductMedia";

type Sent = { text: string; url: string; ref: string };

export default function EnquiryForm({
  defaultName = "",
  defaultEmail = ""
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const { lines, count, ready, clear } = useCart();

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [noteText, setNoteText] = useState("");
  const [deliveryId, setDeliveryId] = useState<string>(SHOP.delivery[1].id);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<Sent | null>(null);
  const [copied, setCopied] = useState(false);

  const delivery = useMemo(
    () => SHOP.delivery.find((d) => d.id === deliveryId) ?? SHOP.delivery[0],
    [deliveryId]
  );

  const needsAddress = delivery.id !== "pickup";

  function submit() {
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (phone.replace(/\D/g, "").length < 10)
      return setError("Please enter a phone number we can reach you on.");
    if (needsAddress && address.trim().length < 6)
      return setError("Please enter the area we would be delivering to.");

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
      return `• ${l.qty} × ${p.brand} ${p.name}${meta ? ` (${meta})` : ""}`;
    });

    const who = [
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      `Preference: ${delivery.label}`,
      needsAddress ? `Area: ${address.trim()}` : null,
      noteText.trim() ? `Note: ${noteText.trim()}` : null
    ].filter(Boolean);

    const text = [
      `PRICE REQUEST — ${SHOP.legalName}`,
      "Please send prices and confirm what is available in my size:",
      items.join("\n"),
      who.join("\n"),
      `Ref: ${ref}`
    ].join("\n\n");

    setSent({ text, url: waLink(text), ref });
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

  /* ---------- after sending ---------- */

  if (sent) {
    return (
      <div className="wrap" style={{ paddingBlock: "clamp(40px, 6vw, 80px)", maxWidth: 720 }}>
        <div className="done">
          <div className="done-seal" aria-hidden="true">
            &#10003;
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>Your request is ready to send</h1>
          <p className="note" style={{ fontSize: 15 }}>
            Send it to us on WhatsApp. We reply with the price of each piece and
            confirm what is on the shelf in your size.
          </p>
          <p className="note">
            Your reference:{" "}
            <span className="num" style={{ color: "var(--gold-bright)" }}>{sent.ref}</span>
          </p>

          <pre className="order-slip">{sent.text}</pre>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%" }}>
            <a
              href={sent.url}
              className="btn btn-gold"
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: "1 1 220px" }}
            >
              Send on WhatsApp
            </a>
            <button
              className="btn btn-line"
              onClick={() => copy(sent.text)}
              style={{ flex: "1 1 160px" }}
            >
              {copied ? "Copied" : "Copy request"}
            </button>
          </div>

          <p className="note">
            If WhatsApp does not open, copy the request above and send it to{" "}
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
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>Your list is empty</h1>
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
          <span className="eyebrow">Enquiry</span>
          <h2>Ask about these pieces</h2>
          <p className="sub">
            Prices are not listed on the site — stock changes and so do they.
            Send us the list and we come back with the price on each one and
            what is on the shelf in your size.
          </p>
        </div>
      </div>

      <div className="checkout">
        <div className="checkout-form">
          <div className="two-fields">
            <div className="field">
              <label htmlFor="en-name">Full name</label>
              <input
                id="en-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Musa Ibrahim"
              />
            </div>
            <div className="field">
              <label htmlFor="en-phone">Phone number</label>
              <input
                id="en-phone"
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
            <label htmlFor="en-email">Email (optional)</label>
            <input
              id="en-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="en-delivery">How would you like it?</label>
            <select
              id="en-delivery"
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
            >
              {SHOP.delivery.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {needsAddress ? (
            <div className="field">
              <label htmlFor="en-address">Which area?</label>
              <textarea
                id="en-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Area and city — the full address can wait until we have agreed the price"
              />
            </div>
          ) : (
            <p className="note">
              Collect from {SHOP.address.street}, {SHOP.address.city}. We are open{" "}
              {SHOP.hours}.
            </p>
          )}

          <div className="field">
            <label htmlFor="en-note">Anything else (optional)</label>
            <textarea
              id="en-note"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="A second colour if the first has gone, another size to check, a budget you are working to…"
            />
          </div>

          {error ? <p className="err">{error}</p> : null}

          <button className="btn btn-gold btn-block" onClick={submit}>
            Send the request
          </button>

          <p className="note">
            This opens WhatsApp with your list already written out. Nothing is
            charged and nothing is committed — we talk first.
          </p>
        </div>

        <aside className="panel summary">
          <h3 style={{ fontSize: 22, marginBottom: 6 }}>Your list</h3>
          <p className="note" style={{ marginBottom: 20 }}>
            {count === 1 ? "1 piece" : `${count} pieces`}
          </p>

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
                <div />
              </div>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
