/* ============================================================
   BARGONI — shop configuration and stock
   This is the file you edit day to day. Everything the site
   shows about the business and its products comes from here.
   ============================================================ */

export const SHOP = {
  name: "Bargoni",
  tagline: "Shoes and Bags",
  legalName: "Bargoni Shoes and Bags",

  /* WhatsApp number that receives orders.
     International format, digits only: drop the leading 0, put 234 in front. */
  whatsapp: "2348038861395",

  phones: ["08038861395", "09017603030"],
  email: "bargonishoesandbags@gmail.com",
  instagram: "bargonishoesandbags",

  address: {
    street: "Zoo Road, near Kano Zoological Garden Main Gate",
    city: "Kano",
    state: "Kano State",
    country: "Nigeria"
  },

  hours: "Monday – Saturday, 9:00am – 8:00pm",
  currency: "₦",

  delivery: [
    { id: "pickup", label: "Collect from the store", fee: 0 },
    { id: "kano", label: "Delivery within Kano", fee: 2500 },
    { id: "nigeria", label: "Delivery elsewhere in Nigeria", fee: 6500 }
  ]
} as const;

export type DeliveryOption = (typeof SHOP.delivery)[number];

/* The houses we carry. Order here is the order shown on the site. */
export const BRANDS = [
  "Gucci",
  "Salvatore Ferragamo",
  "Hermès",
  "Prada",
  "Louis Vuitton",
  "Christian Louboutin",
  "Bottega Veneta",
  "Tom Ford"
] as const;

export type Category = "shoes" | "bags";
export type Condition = "New" | "Pre-owned · excellent" | "Pre-owned · good";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  was?: number;
  condition: Condition;
  blurb: string;
  detail: string;
  sizes: (number | string)[];
  colors: string[];
  /* Put a photo in public/products/ and write "/products/your-file.jpg" here.
     Leave it out and the site draws a lettered plate instead. */
  image?: string;
  tag?: string;
  inStock?: number;
};

export const PRODUCTS: Product[] = [
  {
    slug: "gucci-horsebit-loafer",
    name: "Horsebit Loafer",
    brand: "Gucci",
    category: "shoes",
    price: 690000,
    condition: "New",
    blurb: "Polished leather, signature horsebit hardware",
    detail:
      "The loafer the house is known for. Polished calfskin upper with the gold-tone horsebit across the vamp, leather lining and a slim leather sole. Comes with dust bag and box.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black", "Brown"],
    tag: "In stock now"
  },
  {
    slug: "ferragamo-gancini-driver",
    name: "Gancini Driver",
    brand: "Salvatore Ferragamo",
    category: "shoes",
    price: 520000,
    was: 585000,
    condition: "New",
    blurb: "Suede driving shoe, rubber pebble sole",
    detail:
      "A soft unlined suede driver with the Gancini ornament at the throat and a pebbled rubber sole that runs up the heel. Light, and comfortable straight out of the box.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Navy", "Tobacco", "Black"]
  },
  {
    slug: "louboutin-greggo-oxford",
    name: "Greggo Oxford",
    brand: "Christian Louboutin",
    category: "shoes",
    price: 845000,
    condition: "New",
    blurb: "Full-grain calf, the red sole",
    detail:
      "A clean cap-toe Oxford in full-grain calfskin, built on a slim last with the house's lacquered red sole. The dress shoe for a wedding or a boardroom.",
    sizes: [41, 42, 43, 44, 45],
    colors: ["Black"],
    tag: "Two pairs left"
  },
  {
    slug: "prada-brushed-derby",
    name: "Brushed Leather Derby",
    brand: "Prada",
    category: "shoes",
    price: 610000,
    condition: "New",
    blurb: "Brushed calfskin, notched rubber sole",
    detail:
      "An open-laced derby in brushed calfskin on a lightweight notched rubber sole. Smart enough for the office and built for a full day on your feet.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black", "Dark brown"]
  },
  {
    slug: "tomford-elkan-sneaker",
    name: "Elkan Low Sneaker",
    brand: "Tom Ford",
    category: "shoes",
    price: 735000,
    condition: "New",
    blurb: "Calf and suede, cupsole",
    detail:
      "A low-top sneaker panelled in calfskin and suede on a clean white cupsole, with the house monogram at the heel counter. Understated and unmistakable.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["White", "Black"]
  },
  {
    slug: "gucci-slide-web",
    name: "Web Stripe Slide",
    brand: "Gucci",
    category: "shoes",
    price: 315000,
    condition: "Pre-owned · excellent",
    blurb: "Leather slide, woven web band",
    detail:
      "A leather slide with the green-and-red web band across the foot and a moulded footbed. Worn a handful of times; sole and footbed are clean throughout.",
    sizes: [40, 41, 42, 43],
    colors: ["Black", "White"]
  },
  {
    slug: "hermes-birkin-30",
    name: "Birkin 30",
    brand: "Hermès",
    category: "bags",
    price: 4850000,
    condition: "Pre-owned · excellent",
    blurb: "Togo leather, palladium hardware",
    detail:
      "Birkin 30 in Togo leather with palladium hardware. Corners sharp, hardware unmarked, interior clean. Supplied with clochette, lock, both keys, dust bag and box. Authentication paperwork available on request.",
    sizes: [],
    colors: ["Gold", "Noir", "Etoupe"],
    tag: "One only",
    inStock: 1
  },
  {
    slug: "hermes-evelyne-pm",
    name: "Evelyne PM",
    brand: "Hermès",
    category: "bags",
    price: 2450000,
    condition: "Pre-owned · excellent",
    blurb: "Clemence leather, perforated H",
    detail:
      "The everyday Hermès shoulder bag. Clemence leather with the perforated H on the front panel and an adjustable canvas strap. Light patina on the strap; body is excellent.",
    sizes: [],
    colors: ["Noir", "Gold", "Blue Jean"]
  },
  {
    slug: "lv-neverfull-mm",
    name: "Neverfull MM",
    brand: "Louis Vuitton",
    category: "bags",
    price: 1180000,
    condition: "New",
    blurb: "Coated canvas, leather trim, with pouch",
    detail:
      "The tote that carries everything. Coated canvas with natural cowhide trim that darkens over time, cinch straps at the sides and the removable zip pouch included.",
    sizes: [],
    colors: ["Monogram", "Damier Ebène"],
    tag: "Bestseller"
  },
  {
    slug: "gucci-dionysus-shoulder",
    name: "Dionysus Shoulder Bag",
    brand: "Gucci",
    category: "bags",
    price: 1420000,
    was: 1590000,
    condition: "New",
    blurb: "Suede and canvas, tiger-head closure",
    detail:
      "Structured shoulder bag with the antiqued tiger-head spur closure and a sliding chain that lets it be worn on the shoulder or across the body.",
    sizes: [],
    colors: ["Beige/Ebony", "Black"]
  },
  {
    slug: "bottega-cassette",
    name: "Cassette Intrecciato",
    brand: "Bottega Veneta",
    category: "bags",
    price: 1650000,
    condition: "New",
    blurb: "Padded intrecciato, lambskin",
    detail:
      "The padded woven lambskin bag the house rebuilt its name on. No visible logo anywhere on it — the weave is the signature.",
    sizes: [],
    colors: ["Fondant", "Black", "Barolo"]
  },
  {
    slug: "ferragamo-studio-tote",
    name: "Studio Leather Tote",
    brand: "Salvatore Ferragamo",
    category: "bags",
    price: 780000,
    condition: "New",
    blurb: "Grained calf, 15\" laptop",
    detail:
      "A structured work tote in grained calfskin with the Gancini clasp. Takes a 15-inch laptop, a folder and a water bottle without losing its shape.",
    sizes: [],
    colors: ["Black", "Tan"]
  }
];

/* ---------- small helpers used across the app ---------- */

export const money = (n: number) =>
  SHOP.currency + Math.round(n).toLocaleString("en-NG");

export const fullAddress = () =>
  `${SHOP.address.street}, ${SHOP.address.city}, ${SHOP.address.state}`;

export const waLink = (text?: string) =>
  `https://wa.me/${SHOP.whatsapp}` +
  (text ? `?text=${encodeURIComponent(text)}` : "");

export const getProduct = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);
