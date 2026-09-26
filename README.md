# Bargoni Shoes and Bags

The shop website for Bargoni, Zoo Road, Kano. Customers browse the collection,
pick a size and colour, add pieces to a bag and place an order. The finished
order arrives on WhatsApp as one formatted message with the items, sizes,
delivery address and a reference number.

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
  slug: "gucci-horsebit-loafer",   // unique, lowercase, dashes — becomes the URL
  name: "Horsebit Loafer",
  brand: "Gucci",                  // must match a name in BRANDS
  category: "shoes",               // "shoes" or "bags"
  price: 690000,                   // number only, no commas or ₦
  was: 750000,                     // optional, shows a struck-through old price
  condition: "New",                // or "Pre-owned · excellent" / "· good"
  blurb: "Polished leather, signature horsebit hardware",
  detail: "The longer description on the product page.",
  sizes: [40, 41, 42, 43, 44],     // [] for bags
  colors: ["Black", "Brown"],
  image: "/products/horsebit.jpg", // optional — see below
  tag: "In stock now"              // optional badge
}
```

To stop selling something, delete its block.

To add a house to the filter row, add its name to `BRANDS` at the top of the
same file.

## Product photos

This is the main thing still outstanding. Right now each piece shows a gold
lettered plate instead of a photo.

1. Put the photo in `public/products/`, for example
   `public/products/horsebit-loafer.jpg`
2. Add the `image` line to that product: `image: "/products/horsebit-loafer.jpg"`

Shoot or crop portrait at about **4:5** (1200 × 1500 px is ideal) on a plain
dark or white background. Keep each file under roughly 400 KB — export JPEG at
80% quality or WebP.

Photograph your own stock. Do not copy images from Gucci, Hermès or any other
brand's website: those are their copyright, and the photo would not show the
actual piece the customer is buying.

## Shop details, phones, delivery fees

All in the `SHOP` object at the top of `src/lib/shop.ts` — address, opening
hours, both phone numbers, the WhatsApp number that receives orders, and the
delivery options with their fees:

```ts
delivery: [
  { id: "pickup",  label: "Collect from the store",        fee: 0 },
  { id: "kano",    label: "Delivery within Kano",          fee: 2500 },
  { id: "nigeria", label: "Delivery elsewhere in Nigeria",  fee: 6500 }
]
```

Keep the `pickup` id if you want the address field to disappear for collections.

## Putting it online

**Vercel** is the straightforward option:

1. Go to vercel.com and import this repository.
2. Framework preset is detected as Next.js — leave the build settings alone.
3. Add the two Clerk environment variables in Project Settings → Environment
   Variables (use your **production** Clerk keys here, not the test pair).
4. Deploy. Every push to `main` redeploys.

A custom domain is added from the same project settings.

## Taking card payments

Orders currently settle by transfer, cash or POS once you have confirmed on
WhatsApp. Cards need a **Paystack** or **Flutterwave** merchant account. Once
you have one, the `place()` function in `src/components/CheckoutForm.tsx` is the
only place that changes — it builds the WhatsApp message today and would open
the provider's checkout with the same total instead.

## Notes

- The bag is kept in the visitor's own browser, so it survives a refresh. It is
  not sent anywhere until the order button is pressed.
- The site is a single deliberate dark theme, built around the gold house mark.
- Prices live in the code rather than a database. That is intentional at this
  size: one file to edit and nothing to break. A real stock system with live
  quantities would need a database — worth doing once the range grows.
