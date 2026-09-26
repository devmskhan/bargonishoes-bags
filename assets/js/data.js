/* ============================================================
   BARGONI — your shop's data
   This is the ONLY file you need to edit day to day.
   1. Fill in SHOP with your real details.
   2. Add, edit or remove products in PRODUCTS.
   Save, commit, and the site updates.
   ============================================================ */

const SHOP = {
  name: "Bargoni",
  tagline: "Shoes & Bags",

  // ---- CHANGE THIS ----------------------------------------
  // Your WhatsApp number in international format, digits only.
  // Nigeria: drop the leading 0 and put 234 in front.
  // e.g. 0803 123 4567  ->  "2348031234567"
  whatsapp: "2348000000000",
  // ---------------------------------------------------------

  email: "hello@bargoni.com",
  phoneDisplay: "+234 800 000 0000",
  instagram: "bargoni",
  address: "Lagos, Nigeria",
  hours: "Mon–Sat, 9am – 7pm",

  currency: "₦",

  // Delivery options shown at checkout. Edit freely.
  delivery: [
    { id: "pickup",  label: "Pick up in store",        fee: 0 },
    { id: "lagos",   label: "Delivery within Lagos",   fee: 3000 },
    { id: "nigeria", label: "Delivery outside Lagos",  fee: 6000 }
  ]
};

/* Each product:
   id          unique short text, no spaces
   name        what customers see
   category    "shoes" or "bags"  (drives the filter buttons)
   price       number, no commas
   was         optional. Old price, shows as struck through.
   blurb       one line under the name
   detail      longer text in the product window
   sizes       array. Use [] for bags or one-size items.
   colors      array of colour names you actually stock
   tint        two hex colours — paints the placeholder tile
   image       optional. Put a photo in assets/img/ and write
               "assets/img/your-photo.jpg" here. It replaces the tile.
   tag         optional badge: "New", "Last pair", "Bestseller"...
*/
const PRODUCTS = [
  {
    id: "oxford-noir",
    name: "Noir Oxford",
    category: "shoes",
    price: 68000,
    blurb: "Full-grain leather, Goodyear welted",
    detail: "A closed-lacing Oxford built on a slim last. Full-grain upper, leather-lined, with a stitched welt so it can be resoled rather than replaced.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black", "Dark brown"],
    tint: ["#2B2320", "#463A34"],
    tag: "Bestseller"
  },
  {
    id: "derby-sand",
    name: "Sand Derby",
    category: "shoes",
    price: 54000,
    was: 62000,
    blurb: "Suede upper, crepe sole",
    detail: "An open-laced derby in brushed suede on a soft crepe sole. Light enough for all day, smart enough for the office.",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: ["Sand", "Stone"],
    tint: ["#C9A97E", "#A2825C"]
  },
  {
    id: "loafer-wine",
    name: "Wine Penny Loafer",
    category: "shoes",
    price: 59000,
    blurb: "Hand-stitched apron, leather sole",
    detail: "Slip-on penny loafer with a hand-stitched apron and a saddle strap. Polished leather that deepens in colour with wear.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Oxblood", "Black"],
    tint: ["#6B2436", "#8E3348"],
    tag: "New"
  },
  {
    id: "sneaker-court",
    name: "Court Sneaker",
    category: "shoes",
    price: 45000,
    blurb: "Low-top, cupsole, leather upper",
    detail: "A clean low-top on a vulcanised cupsole. Smooth leather upper with a padded collar and a cotton-drill lining.",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: ["White", "Off-white", "Black"],
    tint: ["#E6E2DB", "#BEB7AC"]
  },
  {
    id: "mule-ivory",
    name: "Ivory Mule",
    category: "shoes",
    price: 38000,
    blurb: "Block heel, softened toe",
    detail: "A 55mm block-heel mule with a gently squared toe and a leather footbed that moulds to the foot.",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: ["Ivory", "Black", "Tan"],
    tint: ["#EFE7DA", "#CFC2AE"]
  },
  {
    id: "sandal-braid",
    name: "Braided Slide",
    category: "shoes",
    price: 27000,
    blurb: "Woven leather, flat sole",
    detail: "Hand-woven leather straps on a flat moulded footbed. Made to be worn hard through the dry season.",
    sizes: [36, 37, 38, 39, 40, 41, 42],
    colors: ["Tan", "Black", "Cream"],
    tint: ["#B98A55", "#8E6438"]
  },
  {
    id: "tote-market",
    name: "Market Tote",
    category: "bags",
    price: 72000,
    blurb: "Vegetable-tanned leather, 14\" laptop",
    detail: "An unlined tote in vegetable-tanned leather that patinas with use. Fits a 14-inch laptop, a folder and the rest of it. Reinforced handle joints.",
    sizes: [],
    colors: ["Tan", "Black", "Oxblood"],
    tint: ["#A9713C", "#7C4F26"],
    tag: "Bestseller"
  },
  {
    id: "crossbody-dusk",
    name: "Dusk Crossbody",
    category: "bags",
    price: 41000,
    blurb: "Adjustable strap, magnetic flap",
    detail: "A compact crossbody with a magnetic flap, one slip pocket inside and a strap that adjusts from shoulder to hip.",
    sizes: [],
    colors: ["Wine", "Black", "Sand"],
    tint: ["#5C2C3C", "#8A4359"]
  },
  {
    id: "satchel-brief",
    name: "Brief Satchel",
    category: "bags",
    price: 96000,
    blurb: "Two gussets, brass hardware",
    detail: "A structured satchel with two gussets, a document sleeve and solid brass hardware. Carries by hand or on the shoulder.",
    sizes: [],
    colors: ["Dark brown", "Black"],
    tint: ["#4A3A2E", "#6B5340"]
  },
  {
    id: "clutch-evening",
    name: "Evening Clutch",
    category: "bags",
    price: 32000,
    blurb: "Pebbled leather, tuck-away chain",
    detail: "Pebbled leather clutch with a chain that tucks inside when you want to carry it in hand. Fits a phone, cards and a lipstick.",
    sizes: [],
    colors: ["Black", "Gold", "Wine"],
    tint: ["#2E282B", "#4E4448"],
    tag: "Last pieces"
  },
  {
    id: "backpack-city",
    name: "City Backpack",
    category: "bags",
    price: 84000,
    blurb: "Padded sleeve, water-resistant base",
    detail: "A day backpack with a padded 15-inch sleeve, a quick-access top pocket and a treated base that shrugs off a wet floor.",
    sizes: [],
    colors: ["Black", "Olive", "Brown"],
    tint: ["#33352E", "#555845"]
  },
  {
    id: "pouch-everyday",
    name: "Everyday Pouch",
    category: "bags",
    price: 18000,
    blurb: "Zip top, card slots",
    detail: "A flat zip pouch with three card slots, sized for a passport and a phone. Good on its own or inside a bigger bag.",
    sizes: [],
    colors: ["Tan", "Black", "Wine", "Cream"],
    tint: ["#C2A184", "#9B7B5E"]
  }
];
