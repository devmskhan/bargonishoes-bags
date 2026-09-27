/* ============================================================
   BARGONI — shop configuration and stock
   This is the file you edit day to day. Everything the site
   shows about the business and its products comes from here.
   ============================================================ */

export const SHOP = {
  name: "Bargoni",
  tagline: "Shoes and Bags",
  legalName: "Bargoni Shoes and Bags",

  /* WhatsApp number that receives enquiries.
     International format, digits only: drop the leading 0, put 234 in front. */
  whatsapp: "2349017603030",

  /* First one is the main line shown as the official contact. */
  phones: ["09017603030", "08038861395"],

  facebook: "https://www.facebook.com/share/p/1Dk7JQSMuN/",

  /* Leave these empty until you have the real ones — anything set here
     is published on the site. Empty means the site simply omits it. */
  email: "" as string,
  instagram: "" as string,

  address: {
    street: "Zoo Road, near Kano Zoological Garden Main Gate",
    city: "Kano",
    state: "Kano State",
    country: "Nigeria"
  },

  hours: "Monday – Saturday, 9:00am – 8:00pm",

  /* How the customer wants to receive it. No fees shown — price and
     delivery are agreed on WhatsApp. */
  delivery: [
    { id: "pickup", label: "Collect from the store" },
    { id: "kano", label: "Delivery within Kano" },
    { id: "nigeria", label: "Delivery elsewhere in Nigeria" }
  ]
} as const;

/* The houses we carry. Order here is the order shown on the site. */
export const BRANDS = [
  "Hermès",
  "Dior",
  "Gucci",
  "Prada",
  "Valentino",
  "Louis Vuitton",
  "Saint Laurent",
  "Loro Piana",
  "Polène",
  "Guess",
  "Timberland"
] as const;

export type Category = "shoes" | "bags";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  blurb: string;
  detail: string;
  sizes: (number | string)[];
  colors: string[];
  /* Put a photo in public/products/ and write "/products/your-file.jpg" here.
     Leave it out and the site draws a lettered plate instead. */
  image?: string;
  tag?: string;
};

export const PRODUCTS: Product[] = [
  /* ---------------- Hermès ---------------- */
  {
    slug: "hermes-izmir-black",
    name: "Izmir Slide — Black",
    brand: "Hermès",
    category: "shoes",
    blurb: "H-cutout band, calfskin, flat sole",
    detail:
      "The house's flat men's slide, cut from grained calfskin with the H shape carved out of the band. Smooth leather footbed and a low, quiet sole. Supplied in the orange box.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black"],
    image: "/products/hermes-izmir-black.jpg"
  },
  {
    slug: "hermes-izmir-navy",
    name: "Izmir Slide — Navy",
    brand: "Hermès",
    category: "shoes",
    blurb: "H-cutout band, grained calfskin",
    detail:
      "The same flat Izmir slide in navy grained calfskin. The colour reads almost black indoors and true navy in daylight. Supplied in the orange box.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Navy"],
    image: "/products/hermes-izmir-navy.jpg"
  },
  {
    slug: "hermes-sellier-slide-black",
    name: "Sellier Disc Slide — Black",
    brand: "Hermès",
    category: "shoes",
    blurb: "Smooth calfskin, silver Sellier disc",
    detail:
      "A padded black calfskin slide with the round Sellier disc set into the band. Cushioned footbed and a thicker sole than the flat Izmir, so it wears more like a comfort slide.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black"],
    image: "/products/hermes-sellier-slide-black.jpg"
  },
  {
    slug: "hermes-croc-slide-blue",
    name: "Croc-Print Disc Slide — Blue",
    brand: "Hermès",
    category: "shoes",
    blurb: "Crocodile-embossed leather, brown footbed",
    detail:
      "Crocodile-embossed leather in two blues across the band, with the Sellier disc at the centre and a contrasting brown leather footbed. The loudest pair on the shelf.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Blue croc"],
    image: "/products/hermes-croc-slide-blue.jpg",
    tag: "Statement piece"
  },
  {
    slug: "hermes-chypre-sandal",
    name: "Chypre Sandal",
    brand: "Hermès",
    category: "shoes",
    blurb: "H-cutout front, adjustable ankle strap",
    detail:
      "The sandal version, with the H-cutout band at the front and a buckled ankle strap that holds the heel. Comes in tan, black and white — say which you want when you enquire.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Tan", "Black", "White"],
    image: "/products/hermes-chypre-sandal.jpg"
  },

  /* ---------------- Dior ---------------- */
  {
    slug: "dior-cd-slide-black",
    name: "CD Crossover Slide — Black",
    brand: "Dior",
    category: "shoes",
    blurb: "Grained calfskin, crossed bands, CD emblem",
    detail:
      "Two wide grained-leather bands crossed over the foot with the CD emblem at the join. Padded footbed and a moulded sole with the house pattern underneath.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black"],
    image: "/products/dior-cd-slide-black.jpg"
  },
  {
    slug: "dior-cd-slide-grey",
    name: "CD Crossover Slide — Grey",
    brand: "Dior",
    category: "shoes",
    blurb: "Smooth leather, suede-look footbed",
    detail:
      "The crossover slide in smooth leather over a pale grey footbed, with the CD emblem on the upper band. Also on the shelf in all black.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Grey", "Black"],
    image: "/products/dior-cd-slide-grey.jpg"
  },
  {
    slug: "dior-oblique-slide-navy",
    name: "Oblique Crossover Slide — Navy",
    brand: "Dior",
    category: "shoes",
    blurb: "Oblique jacquard bands, leather footbed",
    detail:
      "Crossed bands in the navy Oblique jacquard over a black leather footbed. Pattern runs across both straps, so the monogram reads clearly when worn.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Navy Oblique"],
    image: "/products/dior-oblique-slide-navy.jpg"
  },
  {
    slug: "dior-cd-loafer",
    name: "CD Loafer",
    brand: "Dior",
    category: "shoes",
    blurb: "Leather slip-on, metal CD buckle",
    detail:
      "A clean slip-on loafer with the polished CD buckle across the saddle, on a low stacked sole. On the shelf in black and in white.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black", "White"],
    image: "/products/dior-cd-loafer.jpg"
  },

  /* ---------------- Louis Vuitton ---------------- */
  {
    slug: "lv-crossover-slide-grey",
    name: "Crossover Slide — Pale Grey",
    brand: "Louis Vuitton",
    category: "shoes",
    blurb: "Grained leather, LV initials on the footbed",
    detail:
      "Crossed grained-leather bands in pale grey with the initials pressed into the footbed. Tonal throughout — no contrast hardware anywhere on it.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Pale grey"],
    image: "/products/lv-crossover-slide-grey.jpg"
  },
  {
    slug: "lv-monogram-slide-black",
    name: "Monogram Crossover Slide — Black",
    brand: "Louis Vuitton",
    category: "shoes",
    blurb: "Monogram-embossed leather, white initials",
    detail:
      "The crossover slide with the monogram embossed into black grained leather, and the initials picked out in white on the footbed. Subtle until the light catches it.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black monogram"],
    image: "/products/lv-monogram-slide-black.jpg"
  },
  {
    slug: "lv-crossover-slide-brown",
    name: "Crossover Slide — Brown",
    brand: "Louis Vuitton",
    category: "shoes",
    blurb: "Grained leather, tonal finish",
    detail:
      "Crossed grained-leather bands in a deep brown that sits close to black, with the initials embossed on the footbed. The easiest of the three to wear with anything.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Brown"],
    image: "/products/lv-crossover-slide-brown.jpg"
  },
  {
    slug: "lv-logo-slide",
    name: "Logo Band Slide",
    brand: "Louis Vuitton",
    category: "shoes",
    blurb: "Wide logo band, contrast white footbed",
    detail:
      "A single wide band carrying the outlined logo, set over a white footbed. On the shelf in black and in taupe.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Black", "Taupe"],
    image: "/products/lv-logo-slide.jpg"
  },

  /* ---------------- Loro Piana ---------------- */
  {
    slug: "loro-piana-sandal-tan",
    name: "Buckle Sandal — Tan",
    brand: "Loro Piana",
    category: "shoes",
    blurb: "Two-band leather, darkened buckle",
    detail:
      "Quiet luxury, no logo. Two smooth leather bands in tan with a darkened metal buckle at the side, on a slim black sole. Comes with the dust bag and the house tag.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Tan"],
    image: "/products/loro-piana-sandal-tan.jpg"
  },
  {
    slug: "loro-piana-sandal-white",
    name: "Buckle Sandal — White",
    brand: "Loro Piana",
    category: "shoes",
    blurb: "Two-band leather, tan welt",
    detail:
      "The same two-band sandal in white leather over a tan welt and footbed. Clean and unbranded — the shape does the work.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["White"],
    image: "/products/loro-piana-sandal-white.jpg"
  },

  /* ---------------- Saint Laurent ---------------- */
  {
    slug: "saint-laurent-thong-sandal",
    name: "Thong Sandal — Black",
    brand: "Saint Laurent",
    category: "shoes",
    blurb: "Leather thong, tonal monogram",
    detail:
      "A wide-strap leather thong sandal with the monogram in matte black on the band and again on the sole. Cushioned footbed, low profile.",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Black"],
    image: "/products/saint-laurent-thong-sandal.jpg"
  },
  {
    slug: "saint-laurent-crossover-slide",
    name: "Crossover Slide — Black",
    brand: "Saint Laurent",
    category: "shoes",
    blurb: "Crossed leather bands, padded sole",
    detail:
      "Crossed matte leather bands with a small monogram at the side, on a thick padded sole. Supplied with the house dust bag.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black"],
    image: "/products/saint-laurent-crossover-slide.jpg"
  },

  /* ---------------- Timberland ---------------- */
  {
    slug: "timberland-canvas-slip-on",
    name: "Canvas Slip-On",
    brand: "Timberland",
    category: "shoes",
    blurb: "Black canvas, gum sole, D-ring detail",
    detail:
      "A low canvas slip-on with elastic side gores, a metal D-ring at the throat and a gum rubber sole. The everyday pair in this selection.",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Black"],
    image: "/products/timberland-canvas-slip-on.jpg"
  },

  /* ---------------- Bags ---------------- */
  {
    slug: "gucci-marmont-camera-bag",
    name: "GG Marmont Camera Bag",
    brand: "Gucci",
    category: "bags",
    blurb: "Matelassé chevron leather, antique gold GG",
    detail:
      "The chevron-quilted camera bag with the double-G at the front and a heavy chain-and-leather strap. Zip top, one flat pocket inside. Wears short on the shoulder or long across the body.",
    sizes: [],
    colors: ["Black"],
    image: "/products/gucci-marmont-camera-bag.jpg",
    tag: "Bestseller"
  },
  {
    slug: "gucci-blondie-shoulder-bag",
    name: "Blondie Shoulder Bag",
    brand: "Gucci",
    category: "bags",
    blurb: "Smooth leather, round interlocking G",
    detail:
      "A soft rounded shoulder bag in smooth leather with the large round interlocking G set into the front flap, and a chain-and-leather shoulder strap.",
    sizes: [],
    colors: ["Pink"],
    image: "/products/gucci-blondie-shoulder-bag.jpg"
  },
  {
    slug: "prada-cahier-shoulder-bag",
    name: "Cahier Shoulder Bag",
    brand: "Prada",
    category: "bags",
    blurb: "Book-shaped body, metal corners and clasp",
    detail:
      "Shaped like a closed book, in two leathers with polished metal corners and the bar clasp across the front. Chain strap, and the lettering in metal on the flap.",
    sizes: [],
    colors: ["Grey / Black"],
    image: "/products/prada-cahier-shoulder-bag.jpg"
  },
  {
    slug: "valentino-vlogo-top-handle",
    name: "VLogo Top-Handle Bag",
    brand: "Valentino",
    category: "bags",
    blurb: "Grained calfskin, gold hardware, chain strap",
    detail:
      "A structured top-handle bag in grained calfskin, with the VLogo worked into the flap in matching leather and brushed gold hardware. Comes with a detachable leather-and-chain strap.",
    sizes: [],
    colors: ["Forest green"],
    image: "/products/valentino-vlogo-top-handle.jpg",
    tag: "One only"
  },
  {
    slug: "polene-leather-top-handle",
    name: "Leather Top-Handle Bag",
    brand: "Polène",
    category: "bags",
    blurb: "Grained leather, folded flap, no visible logo",
    detail:
      "Quiet, sculptural, and French. Grained leather folded over itself into a soft flap with pleated side panels and a single slim top handle. The only marking is a small plate at the closure.",
    sizes: [],
    colors: ["Chalk"],
    image: "/products/polene-leather-top-handle.jpg"
  },
  {
    slug: "guess-logo-handbag",
    name: "Logo Jacquard Handbag",
    brand: "Guess",
    category: "bags",
    blurb: "Logo jacquard, leather handles, front zip",
    detail:
      "A roomy day bag in logo jacquard with contrasting leather handles, a zip pocket across the front and gold hardware. The easiest one here to carry every day.",
    sizes: [],
    colors: ["Beige / Brown"],
    image: "/products/guess-logo-handbag.jpg"
  }
];

/* ---------- small helpers used across the app ---------- */

export const fullAddress = () =>
  `${SHOP.address.street}, ${SHOP.address.city}, ${SHOP.address.state}`;

export const waLink = (text?: string) =>
  `https://wa.me/${SHOP.whatsapp}` +
  (text ? `?text=${encodeURIComponent(text)}` : "");

export const getProduct = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

/* Categories that actually have stock, so an empty filter never shows. */
export const activeCategories = (): Category[] =>
  (["shoes", "bags"] as Category[]).filter((c) =>
    PRODUCTS.some((p) => p.category === c)
  );

/* Houses that actually have stock, in the BRANDS order above. */
export const activeBrands = (): string[] =>
  BRANDS.filter((b) => PRODUCTS.some((p) => p.brand === b));

export const categoryLabel = (c: Category) =>
  c === "shoes" ? "Shoes" : "Bags";
