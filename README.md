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

## The admin dashboard

`/admin` lets one person add, edit, hide and remove pieces without touching the
code. Changes appear on the site immediately.

**Hiding vs removing.** Hiding takes a piece off the site but keeps its photo
and description, so you can put it back when it is in stock again. Removing
deletes it. For something you have merely sold out of, hide it.

### Setting it up

It needs two things: Clerk (who may sign in) and Vercel Blob (where products
and photos are stored). Both have free tiers that are ample at this size.

**1. Clerk — the admin account**

1. Create an application at [dashboard.clerk.com](https://dashboard.clerk.com).
2. Under **Configure → Email, phone, username**, turn on Email and Password,
   and turn **off** public sign-ups if you do not want customer accounts.
3. Go to **Users → Create user** and make the admin: their email address, and a
   password you choose there. Clerk stores it hashed — it is never in this
   repository, and it should never be sent to anyone in a message.
4. Copy the two API keys from **API Keys**.

**2. Vercel Blob — the storage**

In your Vercel project: **Storage → Create → Blob**, then connect it to this
project. Vercel sets `BLOB_READ_WRITE_TOKEN` on the deployment for you.

**3. The environment variables**

In Vercel, **Project Settings → Environment Variables**:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY   from Clerk
CLERK_SECRET_KEY                    from Clerk
ADMIN_EMAIL                         the admin's email, exactly as in Clerk
BLOB_READ_WRITE_TOKEN               set for you when you connect Blob
```

Redeploy.

### Getting to the dashboard

Three ways in, all leading to the same place:

- **Admin** in the footer of every page — visible to everyone, but it refuses
  anyone who is not the admin, so there is nothing to hide.
- **Dashboard** in the top bar, which appears only once the admin is signed in.
- Typing `/admin` after the site address.

Signed out, the first two land on a sign-in prompt. Sign in with the admin email
and password you created in Clerk, and you are through.

### Who can get in

Only the address in `ADMIN_EMAIL`. Anyone else who signs in — including a
customer with their own account — is refused. The check runs on the server, on
the page and again on every save, so it is not something a person can get past
by fiddling with the browser.

To hand over to somebody else, change `ADMIN_EMAIL` and create that person in
Clerk. To change the password, do it in Clerk; nothing here needs editing.

**Never put the password in this repository.** It is public — anything
committed here can be read by anyone. `ADMIN_EMAIL` is only an address, which is
why it is safe as a variable; the password lives in Clerk alone.

### Where the products actually live

The first time the site runs with a Blob token, the pieces in `src/lib/shop.ts`
are copied into a `catalogue.json` file in Blob. From then on **Blob is the
source of truth** and editing `shop.ts` changes nothing on the live site — use
the dashboard instead.

With no Blob token, every page falls back to `src/lib/shop.ts`, so the shop
still works and only saving is unavailable. That is what you are seeing if the
dashboard shows a warning strip at the top.

## Adding and editing products (in the code)

Once the dashboard is set up this is no longer how you add stock — use `/admin`.
These products in `src/lib/shop.ts` are the **seed**: what the site shows before
Blob is connected, and what gets copied in the first time it is.

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

## The store video

`public/video/bargoni-store.mp4` is the walkthrough of the shop, shown in the
"Inside the store" section on the home page. It is compressed from the original
27 MB down to 5.8 MB, with `public/video/store-poster.jpg` as the still that
shows before anyone presses play.

It does **not** autoplay. A visitor on mobile data chooses whether to spend it,
and the poster frame carries the shop on its own. To replace the video, export
at 540×960 or smaller and keep it under about 6 MB:

```bash
ffmpeg -i new-video.mp4 -vf "scale=540:960" -c:v libx264 -crf 30 \
  -movflags +faststart -c:a aac -b:a 64k -ac 1 public/video/bargoni-store.mp4
```

Then grab a new poster from a frame you like:

```bash
ffmpeg -ss 36 -i public/video/bargoni-store.mp4 -frames:v 1 \
  public/video/store-poster.jpg
```

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
hours, both phone numbers, the WhatsApp number that receives enquiries, the
Facebook link, and how the customer can receive the piece.

`09017603030` is the main line and the number WhatsApp enquiries go to.

`email` and `instagram` are deliberately empty. Fill them in and they appear in
the footer and the contact panel by themselves; leave them empty and the site
simply omits them. Do not put a placeholder there — whatever is set is
published.

Delivery options:

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

## Adding bags and women's shoes

There are no bags on the site yet because there are no photographs of them. Add
entries with `category: "bags"` and `sizes: []` to `PRODUCTS` — the Bags filter
and the Shoes/Bags navigation appear on their own as soon as one exists, and
disappear again if you remove them all.

Women's shoes need no new category — add them with `category: "shoes"` and the
right size run (EU 36–41 rather than 40–45). Add the house to `BRANDS` first if
it is not already listed.

Photographs must be ones you are entitled to use: your own shots of your own
stock, or images your supplier has given you permission to publish. Do not take
product photography from a brand's website — it is their copyright, and it
shows their piece rather than the one you are selling.

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
