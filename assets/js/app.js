/* ============================================================
   Bargoni — shop behaviour
   Renders the catalogue, runs the cart, builds the order.
   You should not need to edit this file to change products —
   edit assets/js/data.js instead.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- helpers ---------- */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const money = (n) => SHOP.currency + Number(n).toLocaleString("en-NG");
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const tintStyle = (p) =>
    `background:linear-gradient(145deg, ${p.tint[0]} 0%, ${p.tint[1]} 100%)`;

  const visual = (p, cls) =>
    p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`
      : `<span class="mono" aria-hidden="true">${esc(p.name.charAt(0))}</span>`;

  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  /* ---------- state ---------- */

  const STORE_KEY = "bargoni.cart.v1";
  let cart = [];
  let filter = "all";
  let openOverlay = null; // "cart" | "product" | null
  let lastFocus = null;

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) cart = JSON.parse(raw) || [];
    } catch (e) {
      cart = [];
    }
    // drop anything whose product no longer exists
    cart = cart.filter((l) => byId(l.id));
  }

  function saveCart() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(cart));
    } catch (e) {
      /* private window or storage blocked — cart still works for this visit */
    }
  }

  const lineKey = (l) => [l.id, l.size || "", l.color || ""].join("|");
  const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = () =>
    cart.reduce((n, l) => n + (byId(l.id) ? byId(l.id).price * l.qty : 0), 0);

  /* ---------- catalogue ---------- */

  function renderGrid() {
    const grid = $("#grid");
    const items = PRODUCTS.filter((p) => filter === "all" || p.category === filter);

    if (!items.length) {
      grid.innerHTML = `<p class="empty">Nothing in this category yet.</p>`;
      return;
    }

    grid.innerHTML = items
      .map(
        (p) => `
      <article class="card">
        <div class="thumb" style="${tintStyle(p)}">
          ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}
          ${visual(p)}
        </div>
        <div class="card-body">
          <span class="card-cat">${p.category === "shoes" ? "Footwear" : "Bags"}</span>
          <h3 class="card-name">${esc(p.name)}</h3>
          <p class="card-blurb">${esc(p.blurb)}</p>
          <div class="price-row">
            <span class="price num">${money(p.price)}</span>
            ${p.was ? `<span class="price-was num">${money(p.was)}</span>` : ""}
          </div>
          <button class="card-cta" data-open="${esc(p.id)}">
            ${p.sizes.length ? "Choose size" : "View & order"}
          </button>
        </div>
      </article>`
      )
      .join("");
  }

  function setFilter(next) {
    filter = next;
    document.querySelectorAll("[data-filter]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.filter === next));
    });
    renderGrid();
  }

  /* ---------- overlays ---------- */

  function closeOverlay() {
    const host = $("#overlay");
    host.innerHTML = "";
    openOverlay = null;
    document.body.style.overflow = "";
    document.body.classList.remove("is-locked");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function mountOverlay(html, focusSel) {
    const host = $("#overlay");
    lastFocus = document.activeElement;
    host.innerHTML = `<div class="scrim" data-close="1"></div>${html}`;
    document.body.style.overflow = "hidden";
    document.body.classList.add("is-locked");
    const first = focusSel ? $(focusSel, host) : null;
    (first || $(".icon-btn", host))?.focus();
  }

  /* ---------- product window ---------- */

  function openProduct(id) {
    const p = byId(id);
    if (!p) return;
    openOverlay = "product";

    const sizes = p.sizes.length
      ? `<div class="opt-group">
           <span class="k">Size (EU)</span>
           <div class="chips" id="sizeChips">
             ${p.sizes
               .map(
                 (s, i) =>
                   `<button class="chip" type="button" data-size="${s}" aria-pressed="${i === 0}">${s}</button>`
               )
               .join("")}
           </div>
         </div>`
      : "";

    const colors = p.colors.length
      ? `<div class="opt-group">
           <span class="k">Colour</span>
           <div class="chips" id="colorChips">
             ${p.colors
               .map(
                 (c, i) =>
                   `<button class="chip" type="button" data-color="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`
               )
               .join("")}
           </div>
         </div>`
      : "";

    mountOverlay(
      `<section class="modal" role="dialog" aria-modal="true" aria-label="${esc(p.name)}">
         <div class="modal-scroll">
           <div class="modal-grid">
             <div class="modal-visual" style="${tintStyle(p)}">
               ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}
               ${visual(p)}
               <button class="icon-btn modal-close" data-close="1" aria-label="Close">&times;</button>
             </div>
             <div class="modal-side">
               <div>
                 <span class="card-cat">${p.category === "shoes" ? "Footwear" : "Bags"}</span>
                 <h2>${esc(p.name)}</h2>
               </div>
               <div class="price-row">
                 <span class="price num" style="font-size:22px">${money(p.price)}</span>
                 ${p.was ? `<span class="price-was num">${money(p.was)}</span>` : ""}
               </div>
               <p class="detail">${esc(p.detail)}</p>
               ${sizes}
               ${colors}
               <button class="btn btn-primary btn-block" id="addToCart">Add to cart</button>
               <p class="note">Order on the site and we confirm on WhatsApp before dispatch. ${esc(SHOP.hours)}.</p>
             </div>
           </div>
         </div>
       </section>`,
      "#addToCart"
    );

    const host = $("#overlay");

    host.querySelectorAll("#sizeChips .chip, #colorChips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        chip.parentElement
          .querySelectorAll(".chip")
          .forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
      });
    });

    $("#addToCart", host).addEventListener("click", () => {
      const size = $('#sizeChips .chip[aria-pressed="true"]', host)?.dataset.size || "";
      const color = $('#colorChips .chip[aria-pressed="true"]', host)?.dataset.color || "";
      addToCart(p.id, size, color);
      closeOverlay();
      toast(p.name + " added to cart");
      updateCartButton();
    });
  }

  /* ---------- cart ---------- */

  function addToCart(id, size, color) {
    const candidate = { id: id, size: size, color: color, qty: 1 };
    const found = cart.find((l) => lineKey(l) === lineKey(candidate));
    if (found) found.qty += 1;
    else cart.push(candidate);
    saveCart();
  }

  function changeQty(key, delta) {
    const line = cart.find((l) => lineKey(l) === key);
    if (!line) return;
    line.qty += delta;
    if (line.qty < 1) cart = cart.filter((l) => lineKey(l) !== key);
    saveCart();
    renderCart();
    updateCartButton();
  }

  function removeLine(key) {
    cart = cart.filter((l) => lineKey(l) !== key);
    saveCart();
    renderCart();
    updateCartButton();
  }

  function updateCartButton() {
    const n = cartCount();
    $("#cartCount").textContent = n;
    $("#cartBtn").setAttribute(
      "aria-label",
      n === 1 ? "Cart, 1 item" : "Cart, " + n + " items"
    );
  }

  function openCart() {
    openOverlay = "cart";
    mountOverlay(
      `<aside class="drawer" role="dialog" aria-modal="true" aria-label="Your cart">
         <div class="drawer-head">
           <h2>Your cart</h2>
           <button class="icon-btn" data-close="1" aria-label="Close cart">&times;</button>
         </div>
         <div class="drawer-body" id="cartBody"></div>
         <div class="drawer-foot" id="cartFoot"></div>
       </aside>`
    );
    renderCart();
  }

  function renderCart() {
    const body = $("#cartBody");
    const foot = $("#cartFoot");
    if (!body) return;

    if (!cart.length) {
      body.innerHTML = `
        <div class="done">
          <p class="note" style="font-size:15px">Your cart is empty.</p>
        </div>`;
      foot.innerHTML = `<button class="btn btn-ghost btn-block" data-close="1">Keep shopping</button>`;
      return;
    }

    body.innerHTML = cart
      .map((l) => {
        const p = byId(l.id);
        const meta = [l.size ? "Size " + l.size : "", l.color].filter(Boolean).join(" · ");
        return `
        <div class="line">
          <div class="line-thumb" style="${tintStyle(p)}">${visual(p)}</div>
          <div>
            <div class="line-name">${esc(p.name)}</div>
            ${meta ? `<div class="line-meta">${esc(meta)}</div>` : ""}
            <div class="qty">
              <button type="button" data-qty="${esc(lineKey(l))}" data-delta="-1" aria-label="Reduce quantity">&minus;</button>
              <span>${l.qty}</span>
              <button type="button" data-qty="${esc(lineKey(l))}" data-delta="1" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div style="text-align:right">
            <div class="line-price num">${money(p.price * l.qty)}</div>
            <button class="line-remove" type="button" data-remove="${esc(lineKey(l))}">Remove</button>
          </div>
        </div>`;
      })
      .join("");

    foot.innerHTML = `
      <div class="totals">
        <div><span>Subtotal</span><span class="num">${money(subtotal())}</span></div>
        <div><span>Delivery</span><span>Chosen at checkout</span></div>
      </div>
      <button class="btn btn-primary btn-block" id="toCheckout">Checkout · ${money(subtotal())}</button>
      <button class="btn btn-ghost btn-block" data-close="1">Keep shopping</button>`;

    $("#toCheckout").addEventListener("click", renderCheckout);
  }

  /* ---------- checkout ---------- */

  function renderCheckout() {
    const body = $("#cartBody");
    const foot = $("#cartFoot");

    body.innerHTML = `
      <p class="note">Fill this in and we'll have your order, your size and your address in one message. We confirm stock and delivery time before you pay.</p>
      <div class="field">
        <label for="coName">Full name</label>
        <input id="coName" name="name" type="text" autocomplete="name" placeholder="Adaeze Okonkwo">
      </div>
      <div class="field">
        <label for="coPhone">Phone number</label>
        <input id="coPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0803 123 4567">
      </div>
      <div class="field">
        <label for="coDelivery">Delivery</label>
        <select id="coDelivery" name="delivery">
          ${SHOP.delivery
            .map(
              (d) =>
                `<option value="${esc(d.id)}">${esc(d.label)}${d.fee ? " — " + money(d.fee) : " — free"}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="field" id="addrField">
        <label for="coAddress">Delivery address</label>
        <textarea id="coAddress" name="address" placeholder="Street, area, landmark"></textarea>
      </div>
      <div class="field">
        <label for="coNote">Anything else (optional)</label>
        <textarea id="coNote" name="note" placeholder="Gift wrap, preferred delivery day, a second colour if the first is out of stock…"></textarea>
      </div>
      <p class="err" id="coErr" hidden></p>`;

    foot.innerHTML = `
      <div class="totals" id="coTotals"></div>
      <button class="btn btn-primary btn-block" id="placeOrder">Place order</button>
      <button class="btn btn-ghost btn-block" id="backToCart">Back to cart</button>`;

    const sel = $("#coDelivery");
    const addr = $("#addrField");

    function refresh() {
      const d = SHOP.delivery.find((x) => x.id === sel.value) || SHOP.delivery[0];
      addr.hidden = d.fee === 0 && d.id === "pickup";
      $("#coTotals").innerHTML = `
        <div><span>Subtotal</span><span class="num">${money(subtotal())}</span></div>
        <div><span>${esc(d.label)}</span><span class="num">${d.fee ? money(d.fee) : "Free"}</span></div>
        <div class="grand"><span>Total</span><span class="num">${money(subtotal() + d.fee)}</span></div>`;
    }

    sel.addEventListener("change", refresh);
    refresh();

    $("#backToCart").addEventListener("click", renderCart);
    $("#placeOrder").addEventListener("click", submitOrder);
    $("#coName").focus();
  }

  function buildOrderText(c) {
    const lines = cart.map((l) => {
      const p = byId(l.id);
      const meta = [l.size ? "size " + l.size : "", l.color].filter(Boolean).join(", ");
      return `• ${l.qty} × ${p.name}${meta ? " (" + meta + ")" : ""} — ${money(p.price * l.qty)}`;
    });

    const customer = [
      `Name: ${c.name}`,
      `Phone: ${c.phone}`,
      c.address ? `Address: ${c.address}` : null,
      c.note ? `Note: ${c.note}` : null
    ].filter(Boolean);

    const blocks = [
      `NEW ORDER — ${SHOP.name}`,
      lines.join("\n"),
      [
        `Subtotal: ${money(subtotal())}`,
        `${c.delivery.label}: ${c.delivery.fee ? money(c.delivery.fee) : "Free"}`,
        `Total: ${money(subtotal() + c.delivery.fee)}`
      ].join("\n"),
      customer.join("\n"),
      `Ref: ${c.ref}`
    ];

    return blocks.join("\n\n");
  }

  function submitOrder() {
    const name = $("#coName").value.trim();
    const phone = $("#coPhone").value.trim();
    const address = $("#coAddress").value.trim();
    const note = $("#coNote").value.trim();
    const delivery =
      SHOP.delivery.find((d) => d.id === $("#coDelivery").value) || SHOP.delivery[0];
    const err = $("#coErr");

    if (name.length < 2) return fail("Please enter your full name.", "#coName");
    if (phone.replace(/\D/g, "").length < 10)
      return fail("Please enter a phone number we can reach you on.", "#coPhone");
    if (delivery.id !== "pickup" && address.length < 6)
      return fail("Please enter the address we should deliver to.", "#coAddress");

    err.hidden = true;

    const ref =
      "BG-" +
      new Date().toISOString().slice(2, 10).replace(/-/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    const text = buildOrderText({ name, phone, address, note, delivery, ref });
    const waUrl = "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(text);

    cart = [];
    saveCart();
    updateCartButton();
    renderDone(text, waUrl, ref);

    function fail(msg, sel) {
      err.textContent = msg;
      err.hidden = false;
      $(sel).focus();
      return false;
    }
  }

  function renderDone(text, waUrl, ref) {
    $("#cartBody").innerHTML = `
      <div class="done">
        <div class="done-mark" aria-hidden="true">&check;</div>
        <h3>Order ready to send</h3>
        <p class="note">Tap the button to send it to us on WhatsApp. We reply to confirm stock, the total and your delivery time.</p>
        <p class="note"><strong>Your reference:</strong> <span class="num">${esc(ref)}</span></p>
      </div>
      <div class="order-text" id="orderText">${esc(text)}</div>
      <p class="note">If WhatsApp doesn't open, copy the order above and send it to <strong>${esc(SHOP.phoneDisplay)}</strong> or email <strong>${esc(SHOP.email)}</strong>.</p>`;

    $("#cartFoot").innerHTML = `
      <a class="btn btn-primary btn-block" href="${esc(waUrl)}" target="_blank" rel="noopener">Send order on WhatsApp</a>
      <button class="btn btn-ghost btn-block" id="copyOrder">Copy order</button>`;

    $("#copyOrder").addEventListener("click", function () {
      const btn = this;
      const done = () => {
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy order"), 1800);
      };
      const fallback = () => {
        const el = $("#orderText");
        const r = document.createRange();
        r.selectNodeContents(el);
        const s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        btn.textContent = "Selected — press copy";
        setTimeout(() => (btn.textContent = "Copy order"), 2400);
      };
      try {
        navigator.clipboard.writeText(text).then(done, fallback);
      } catch (e) {
        fallback();
      }
    });
  }

  /* ---------- toast ---------- */

  let toastTimer = null;
  function toast(msg) {
    const old = $("#toast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.id = "toast";
    el.setAttribute("role", "status");
    el.textContent = msg;
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 2400);
  }

  /* ---------- wiring ---------- */

  function fillShopDetails() {
    document.title = SHOP.name + " — " + SHOP.tagline;
    document.querySelectorAll("[data-shop]").forEach((el) => {
      const key = el.dataset.shop;
      if (SHOP[key] != null) el.textContent = SHOP[key];
    });
    const wa = "https://wa.me/" + SHOP.whatsapp;
    document.querySelectorAll("[data-wa]").forEach((a) => (a.href = wa));
    document.querySelectorAll("[data-mail]").forEach((a) => {
      a.href = "mailto:" + SHOP.email;
      a.textContent = SHOP.email;
    });
    const ig = $("[data-ig]");
    if (ig) {
      ig.href = "https://instagram.com/" + SHOP.instagram;
      ig.textContent = "@" + SHOP.instagram;
    }
    const yr = $("#year");
    if (yr) yr.textContent = new Date().getFullYear();
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open],[data-filter],[data-close],[data-qty],[data-remove]");
    if (!t) return;

    if (t.dataset.open) return openProduct(t.dataset.open);
    if (t.dataset.filter) return setFilter(t.dataset.filter);
    if (t.dataset.close !== undefined) return closeOverlay();
    if (t.dataset.qty) return changeQty(t.dataset.qty, Number(t.dataset.delta));
    if (t.dataset.remove) return removeLine(t.dataset.remove);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openOverlay) closeOverlay();
  });

  loadCart();
  fillShopDetails();
  renderGrid();
  updateCartButton();
  $("#cartBtn").addEventListener("click", openCart);
})();
