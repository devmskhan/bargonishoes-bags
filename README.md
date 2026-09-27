# Bargoni Shoes and Bags

The shop website for Bargoni, Zoo Road, Kano. Customers browse the collection,
pick a size and colour, build a list and request prices. The request arrives on
WhatsApp as one formatted message with the pieces, sizes, colours and a
reference number.

**Prices are deliberately not shown on the site.** Stock and prices move, so
the site's job is to show what is on the shelf and get the customer talking to
you.

Built with **Next.js 15** (App Router, TypeScript) and **Clerk** for customer
accounts.

```
src/lib/shop.ts            ← shop details and products (the file you edit)
src/app/                   pages: home, shop, product, checkout, account, auth
src/components/            header, cart, product cards, checkout form
src/app/globals.css        the whole design
public/logo-mark.png       the B-and-shoe mark, cut from your artwork
public/products/           put product photos here
```

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The shop works immediately — sign-in switches
on once you add Clerk keys.

## Clerk keys

Create an application at [dashboard.clerk.com](https://dashboard.clerk.com),
copy `.env.example` to `.env.local`, and paste your two keys:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
```

Both keys start with a prefix Clerk shows you in the dashboard — the publishable
one is safe in the browser, the secret one must never be committed. `.env.local`
is already in `.gitignore`.

Restart the dev server. You will then get Sign in / Account in the header, a
protected `/account` page, and checkout prefilled with the customer's name and
email.

Without these keys the storefront still runs in full — ordering does not depend
on sign-in.

## Adding and editing products

Everything customers see lives in `PRODUCTS` in `src/lib/shop.ts`. Copy a block,
change the values, save.

```ts
{
  slug: "hermes-izmir-black",      // unique, lowercase, dashes — becomes the URL
  name: "Izmir Slide — Black",
  brand: "Hermès",                  // must match a name in BRANDS
  category: "shoes",               // "shoes" or "bags"
  blurb: "H-cutout band, calfskin, flat sole",
  detail: "The longer description on the product page.",
  sizes: [40, 41, 42, 43, 44],     // [] for bags
  colors: ["Black"],
  image: "/products/hermes-izmir-black.jpg",  // optional — see below
  tag: "Statement piece"           // optional badge
}
```

To stop selling something, delete its block.

To add a house to the filter row, add its name to `BRANDS` at the top of the
same file.

## Product photos

Eighteen pairs are in with photographs. To add more:

1. Put the photo in `public/products/`, for example
   `public/products/horsebit-loafer.jpg`
2. Add the `image` line to that product: `image: "/products/horsebit-loafer.jpg"`

Shoot or crop portrait at about **4:5** (1200 × 1500 px is ideal) on a plain
dark or white background. Keep each file under roughly 400 KB — export JPEG at
80% quality or WebP.

Photograph your own stock. Do not copy images from Gucci, Hermès or any other
brand's website: those are their copyright, and the photo would not show the
actual piece the customer is buying.

## Shop details, phones, delivery options

All in the `SHOP` object at the top of `src/lib/shop.ts` — address, opening
hours, both phone numbers, the WhatsApp number that receives enquiries, and how
the customer can receive the piece:

```ts
delivery: [
  { id: "pickup",  label: "Collect from the store" },
  { id: "kano",    label: "Delivery within Kano" },
  { id: "nigeria", label: "Delivery elsewhere in Nigeria" }
]
```

No fees are shown — delivery is agreed along with the price. Keep the `pickup`
id if you want the area field to disappear for collections.

## Putting it online

**Vercel** is the straightforward option:

1. Go to vercel.com and import this repository.
2. Framework preset is detected as Next.js — leave the build settings alone.
3. Add the two Clerk environment variables in Project Settings → Environment
   Variables (use your **production** Clerk keys here, not the test pair).
4. Deploy. Every push to `main` redeploys.

A custom domain is added from the same project settings.

## Adding bags

There are no bags on the site yet because there are no photographs of them. Add
entries with `category: "bags"` and `sizes: []` to `PRODUCTS` — the Bags filter
and the Shoes/Bags navigation appear on their own as soon as one exists, and
disappear again if you remove them all.

## If you later want to show prices and take payment

Add a `price` field back to the products and show it on the card and product
page, then wire the request button to **Paystack** or **Flutterwave** — that
needs a merchant account. The `submit()` function in
`src/components/EnquiryForm.tsx` is the one place that changes.

## Notes

- The bag is kept in the visitor's own browser, so it survives a refresh. It is
  not sent anywhere until the order button is pressed.
- The site is a single deliberate dark theme, built around the gold house mark.
- Stock lives in the code rather than a database. That is intentional at this
  size: one file to edit and nothing to break. A real stock system with live
  quantities would need a database — worth doing once the range grows.
- Product names describe what each piece actually is. Correct any that do not
  match how you sell them.
