"use client";

import { useMemo, useRef, useState } from "react";
import { BRANDS } from "@/lib/shop";
import type { StoredProduct } from "@/lib/catalogue";

type Draft = {
  id?: string;
  name: string;
  brand: string;
  category: "shoes" | "bags";
  blurb: string;
  detail: string;
  sizes: string;
  colors: string;
  image: string;
  tag: string;
};

const EMPTY: Draft = {
  name: "",
  brand: "",
  category: "shoes",
  blurb: "",
  detail: "",
  sizes: "",
  colors: "",
  image: "",
  tag: ""
};

const toDraft = (p: StoredProduct): Draft => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  category: p.category,
  blurb: p.blurb ?? "",
  detail: p.detail ?? "",
  sizes: (p.sizes ?? []).join(", "),
  colors: (p.colors ?? []).join(", "),
  image: p.image ?? "",
  tag: p.tag ?? ""
});

const SIZE_RUNS: [string, string][] = [
  ["Men EU 40–45", "40, 41, 42, 43, 44, 45"],
  ["Women EU 36–41", "36, 37, 38, 39, 40, 41"],
  ["One size / bag", ""]
];

export default function AdminDashboard({
  initial,
  storageReady
}: {
  initial: StoredProduct[];
  storageReady: boolean;
}) {
  const [items, setItems] = useState<StoredProduct[]>(initial);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      `${p.brand} ${p.name} ${p.category}`.toLowerCase().includes(q)
    );
  }, [items, filter]);

  const counts = useMemo(
    () => ({
      total: items.length,
      shoes: items.filter((p) => p.category === "shoes" && !p.hidden).length,
      bags: items.filter((p) => p.category === "bags" && !p.hidden).length,
      hidden: items.filter((p) => p.hidden).length
    }),
    [items]
  );

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const say = (kind: "ok" | "bad", text: string) => {
    setMsg({ kind, text });
    window.setTimeout(() => setMsg(null), 4000);
  };

  function reset() {
    setDraft(EMPTY);
    setEditing(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function upload(file: File) {
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      set("image", data.url as string);
      say("ok", "Photo uploaded.");
    } catch (e) {
      say("bad", e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!draft.name.trim()) return say("bad", "Give the piece a name.");
    if (!draft.brand.trim()) return say("bad", "Choose or type the house.");

    setBusy(true);
    try {
      const editingId = draft.id;
      const res = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft)
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save.");

      const saved = data.product as StoredProduct;
      setItems((prev) =>
        editingId ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev]
      );
      say("ok", editingId ? "Changes saved." : `${saved.name} added.`);
      reset();
    } catch (e) {
      say("bad", e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleHidden(p: StoredProduct) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !p.hidden })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update.");
      const saved = data.product as StoredProduct;
      setItems((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
      say("ok", saved.hidden ? `${saved.name} hidden.` : `${saved.name} back on the site.`);
    } catch (e) {
      say("bad", e instanceof Error ? e.message : "Could not update.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(p: StoredProduct) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not remove.");
      setItems((prev) => prev.filter((x) => x.id !== p.id));
      if (draft.id === p.id) reset();
      say("ok", `${p.name} removed.`);
    } catch (e) {
      say("bad", e instanceof Error ? e.message : "Could not remove.");
    } finally {
      setConfirmId(null);
      setBusy(false);
    }
  }

  const houses = useMemo(() => {
    const extra = items.map((p) => p.brand).filter(Boolean);
    return Array.from(new Set([...BRANDS, ...extra])).sort();
  }, [items]);

  return (
    <div className="wrap admin">
      <div className="section-head" style={{ marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h2>Manage the collection</h2>
          <p className="sub">
            What you change here is what customers see. Hiding a piece keeps its
            photo and details for later; removing it deletes them.
          </p>
        </div>
      </div>

      {!storageReady ? (
        <p className="banner-warn">
          Storage is not connected yet, so nothing you do here will save. Add the
          <code> BLOB_READ_WRITE_TOKEN</code> environment variable in Vercel and
          redeploy. Until then this page shows the pieces built into the code.
        </p>
      ) : null}

      <div className="admin-counts">
        <div><span className="k">On the site</span><span className="v num">{counts.shoes + counts.bags}</span></div>
        <div><span className="k">Shoes</span><span className="v num">{counts.shoes}</span></div>
        <div><span className="k">Bags</span><span className="v num">{counts.bags}</span></div>
        <div><span className="k">Hidden</span><span className="v num">{counts.hidden}</span></div>
      </div>

      {msg ? (
        <p className={msg.kind === "ok" ? "admin-note ok" : "admin-note bad"} role="status">
          {msg.text}
        </p>
      ) : null}

      <div className="admin-grid">
        {/* ---------------- the form ---------------- */}
        <section className="panel admin-form">
          <h3>{editing ? "Edit piece" : "Add a piece"}</h3>

          <div className="field">
            <label htmlFor="ad-photo">Photo</label>
            <div className="upload-row">
              <div className="upload-preview">
                {draft.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={draft.image} alt="" />
                ) : (
                  <span className="upload-empty">No photo</span>
                )}
              </div>
              <div className="upload-controls">
                <input
                  id="ad-photo"
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(f);
                  }}
                />
                <p className="note">
                  Portrait, roughly 4:5. Under 8 MB. Uploads as soon as you choose it.
                </p>
                {draft.image ? (
                  <button className="drop" onClick={() => set("image", "")}>
                    Remove photo
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="two-fields">
            <div className="field">
              <label htmlFor="ad-name">Name</label>
              <input
                id="ad-name"
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Izmir Slide — Black"
              />
            </div>
            <div className="field">
              <label htmlFor="ad-brand">House</label>
              <input
                id="ad-brand"
                list="ad-houses"
                value={draft.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="Hermès"
              />
              <datalist id="ad-houses">
                {houses.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="field">
            <label htmlFor="ad-cat">Type</label>
            <select
              id="ad-cat"
              value={draft.category}
              onChange={(e) => set("category", e.target.value as "shoes" | "bags")}
            >
              <option value="shoes">Shoes</option>
              <option value="bags">Bags</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="ad-sizes">Sizes</label>
            <input
              id="ad-sizes"
              value={draft.sizes}
              onChange={(e) => set("sizes", e.target.value)}
              placeholder="40, 41, 42, 43, 44, 45"
            />
            <div className="chips" style={{ marginTop: 8 }}>
              {SIZE_RUNS.map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  className="chip"
                  onClick={() => set("sizes", value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="note">
              Separate with commas. Leave empty for bags — the size picker then
              does not appear.
            </p>
          </div>

          <div className="field">
            <label htmlFor="ad-colors">Colours</label>
            <input
              id="ad-colors"
              value={draft.colors}
              onChange={(e) => set("colors", e.target.value)}
              placeholder="Black, Navy, Tan"
            />
            <p className="note">Separate with commas. The customer picks one.</p>
          </div>

          <div className="field">
            <label htmlFor="ad-blurb">One-line description</label>
            <input
              id="ad-blurb"
              value={draft.blurb}
              onChange={(e) => set("blurb", e.target.value)}
              placeholder="H-cutout band, calfskin, flat sole"
            />
            <p className="note">Shown under the name on the grid.</p>
          </div>

          <div className="field">
            <label htmlFor="ad-detail">Full description</label>
            <textarea
              id="ad-detail"
              value={draft.detail}
              onChange={(e) => set("detail", e.target.value)}
              placeholder="What it is made of, how it wears, what comes with it."
            />
          </div>

          <div className="field">
            <label htmlFor="ad-tag">Badge (optional)</label>
            <input
              id="ad-tag"
              value={draft.tag}
              onChange={(e) => set("tag", e.target.value)}
              placeholder="One only"
            />
            <p className="note">A short label on the photo. Leave empty for none.</p>
          </div>

          <div className="admin-actions">
            <button className="btn btn-gold" onClick={save} disabled={busy}>
              {busy ? "Working…" : editing ? "Save changes" : "Add to the collection"}
            </button>
            {editing ? (
              <button className="btn btn-line" onClick={reset} disabled={busy}>
                Cancel
              </button>
            ) : null}
          </div>
        </section>

        {/* ---------------- the list ---------------- */}
        <section className="admin-list">
          <div className="field" style={{ marginBottom: 18 }}>
            <label htmlFor="ad-search">Search the collection</label>
            <input
              id="ad-search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Hermès, slide, bag…"
            />
          </div>

          {shown.length === 0 ? (
            <p className="note" style={{ fontSize: 15 }}>
              Nothing matches that.
            </p>
          ) : (
            shown.map((p) => (
              <article
                key={p.id}
                className={p.hidden ? "admin-row is-hidden" : "admin-row"}
              >
                <div className="admin-thumb">
                  {p.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.image} alt="" />
                  ) : (
                    <span className="plate-letter" style={{ fontSize: 22 }}>
                      {p.brand.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="admin-meta">
                  <span className="line-brand">{p.brand}</span>
                  <div className="line-name">{p.name}</div>
                  <div className="line-meta">
                    {p.category === "shoes" ? "Shoes" : "Bags"}
                    {p.sizes?.length ? ` · EU ${p.sizes.join(", ")}` : ""}
                    {p.hidden ? " · hidden" : ""}
                  </div>
                </div>

                <div className="admin-row-actions">
                  <button
                    className="chip"
                    onClick={() => {
                      setDraft(toDraft(p));
                      setEditing(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={busy}
                  >
                    Edit
                  </button>
                  <button className="chip" onClick={() => toggleHidden(p)} disabled={busy}>
                    {p.hidden ? "Show" : "Hide"}
                  </button>
                  {confirmId === p.id ? (
                    <>
                      <button
                        className="chip danger"
                        onClick={() => remove(p)}
                        disabled={busy}
                      >
                        Really remove
                      </button>
                      <button className="chip" onClick={() => setConfirmId(null)}>
                        Keep
                      </button>
                    </>
                  ) : (
                    <button className="chip" onClick={() => setConfirmId(p.id)} disabled={busy}>
                      Remove
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
