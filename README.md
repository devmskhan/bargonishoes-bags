# Bargoni — Shoes & Bags

The shop website. Customers browse the collection, pick a size and colour, add to a cart,
and place an order. The finished order arrives as a single formatted WhatsApp message with
the items, sizes, delivery address and a reference number.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no server needed.

```
index.html              the page
assets/css/styles.css   all styling
assets/js/data.js       ← your shop details and products (edit this one)
assets/js/app.js        cart, checkout and order logic
assets/img/             put product photos here
```

## First thing to do: add your WhatsApp number

Open `assets/js/data.js` and change this line:

```js
whatsapp: "2348000000000",
```

Use international format, digits only. For a Nigerian number, drop the leading `0` and
put `234` in front — `0803 123 4567` becomes `2348031234567`.

Then fill in the rest of `SHOP`: email, phone, Instagram handle, store address, opening hours.

Until you do this, the order button points at a placeholder number and orders will go nowhere.

## Adding or changing a product

Everything customers see comes from the `PRODUCTS` list in `assets/js/data.js`. Copy an
existing block, change the values, save.

```js
{
  id: "loafer-wine",          // unique, no spaces — used internally
  name: "Wine Penny Loafer",
  category: "shoes",          // "shoes" or "bags" — drives the filter buttons
  price: 59000,               // number only, no commas or ₦
  was: 68000,                 // optional — shows a struck-through old price
  blurb: "Hand-stitched apron, leather sole",
  detail: "Longer description shown in the product window.",
  sizes: [40, 41, 42, 43, 44], // use [] for bags and one-size items
  colors: ["Oxblood", "Black"],
  tint: ["#6B2436", "#8E3348"], // two colours for the placeholder tile
  tag: "New"                    // optional badge
}
```

To remove a product, delete its block. To hide one temporarily, put `//` at the start of
each of its lines.

## Using real photos

Drop the image into `assets/img/`, then add an `image` line to that product:

```js
image: "assets/img/wine-loafer.jpg",
```

The photo replaces the coloured placeholder tile. Portrait shots at roughly 4:5 look best
(for example 1200 × 1500 px). Keep each file under about 300 KB so the page stays fast —
export as JPEG at 80% quality, or WebP.

## Delivery fees

Also in `assets/js/data.js`:

```js
delivery: [
  { id: "pickup",  label: "Pick up in store",       fee: 0 },
  { id: "lagos",   label: "Delivery within Lagos",  fee: 3000 },
  { id: "nigeria", label: "Delivery outside Lagos", fee: 6000 }
]
```

Add, remove or reprice these freely. The `pickup` entry is the one that hides the address
field at checkout, so keep that `id` if you want that behaviour.

## Viewing it on your computer

Open `index.html` in a browser. That is all — there is nothing to install or run.

## Putting it online

**Vercel** — go to vercel.com, New Project, import this repository, deploy. Leave every
build setting empty; it is a static site. Every push to `main` redeploys automatically.

**GitHub Pages** — in this repository: Settings → Pages → Source: "Deploy from a branch",
branch `main`, folder `/ (root)`, Save. The site appears at
`https://devmskhan.github.io/bargonishoes-bags/` within a minute or two.

Either host is free at this size. A custom domain (bargoni.com and the like) can be pointed
at either one from the same settings page.

## Taking card payments

Right now orders come through WhatsApp, and you collect payment by transfer, cash or POS on
delivery. That needs no account and no fees.

To take card payments on the site instead, you need a **Paystack** or **Flutterwave**
merchant account. Once you have one, the checkout button in `assets/js/app.js` is the single
place that changes — it currently builds a WhatsApp message, and would instead open the
payment provider's checkout with the same total. Say the word and it can be wired up.

## Notes

- The cart is kept in the visitor's own browser, so it survives a page refresh. It is not
  sent anywhere until they press the order button.
- The page follows the visitor's light or dark system setting.
- Prices are written in the code, not in a database. That is deliberate at this size: one
  file to edit, nothing to break.
