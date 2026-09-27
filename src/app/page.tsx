import Link from "next/link";
import {
  SHOP,
  activeBrands,
  activeCategories,
  fullAddress,
  waLink
} from "@/lib/shop";
import { getVisibleCatalogue } from "@/lib/catalogue";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getVisibleCatalogue();
  const featured = products.slice(0, 8);
  const houses = activeBrands(products);
  const hasBags = activeCategories(products).includes("bags");

  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <span className="eyebrow">Hermès · Dior · Louis Vuitton · and more</span>
            <h1>
              Designer shoes and bags,{" "}
              <span className="gold-text">made from the best materials</span>.
            </h1>
            <p className="lede">
              We stock the houses people actually ask for, and we check every
              piece by hand before it reaches the shelf. Put what you like on a
              list, and we come back with the price and your size.
            </p>
            <div className="hero-cta">
              <Link href="/shop" className="btn btn-gold">
                View the collection
              </Link>
              {hasBags ? (
                <Link href="/shop?c=bags" className="btn btn-line">
                  Shop the bags
                </Link>
              ) : null}
            </div>
          </div>
          <div className="hero-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt={`${SHOP.name} house mark`} />
          </div>
        </div>
      </section>

      <div className="houses">
        <div className="wrap houses-inner">
          {houses.map((b) => (
            <Link key={b} href={`/shop?b=${encodeURIComponent(b)}`} className="house">
              {b}
            </Link>
          ))}
        </div>
      </div>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">In store now</span>
            <h2>Selected pieces</h2>
            <p className="sub">
              A sample of what is on the shelf this week. Stock moves quickly —
              message us to confirm a size before you travel.
            </p>
          </div>
          <Link href="/shop" className="btn btn-line">
            See everything
          </Link>
        </div>

        <div className="grid">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      </section>

      {hasBags ? (
        <section className="banner" aria-labelledby="bags-banner-heading">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="banner-img" src="/bags-banner.jpg" alt="" />
          <div className="wrap banner-inner">
            <span className="eyebrow">Handbags</span>
            <h2 id="bags-banner-heading">The bags, in one place.</h2>
            <p>
              Gucci, Prada, Valentino, Polène and more — top-handle, shoulder
              and crossbody, on the shelf at Zoo Road.
            </p>
            <Link href="/shop?c=bags" className="btn btn-gold">
              View the bags collection
            </Link>
          </div>
        </section>
      ) : null}

      <div className="houses">
        <div className="wrap assure">
          <div className="assure-item">
            <span className="assure-num">01</span>
            <h3>Checked in person</h3>
            <p>
              Every pair and every bag is inspected here before it is listed —
              stitching, hardware, lining, sole. If something is not right, it
              does not go on the shelf.
            </p>
          </div>
          <div className="assure-item">
            <span className="assure-num">02</span>
            <h3>Try before you commit</h3>
            <p>
              Come to the store and try the size. If you buy online in Kano and
              the fit is wrong, we exchange it within seven days, unworn.
            </p>
          </div>
          <div className="assure-item">
            <span className="assure-num">03</span>
            <h3>A person, not a form</h3>
            <p>
              Your list reaches us on WhatsApp and we reply with the price of
              each piece and what is on the shelf in your size. Nothing is
              committed until we have spoken.
            </p>
          </div>
        </div>
      </div>

      <section className="section wrap">
        <div className="film">
          <div className="film-frame">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/video/store-poster.jpg"
            >
              <source src="/video/bargoni-store.mp4" type="video/mp4" />
              Your browser cannot play this video. Come and see the shop in
              person at {SHOP.address.street}.
            </video>
          </div>

          <div className="film-copy">
            <span className="eyebrow">Inside the store</span>
            <h2>Eighty seconds on the shop floor.</h2>
            <p>
              Wall to wall, floor to ceiling. This is the same stock you are
              looking at on this site — the shelves, the boxes, the counter,
              filmed on an ordinary working day.
            </p>
            <p>
              We do not list prices online because they move. What does not
              move is the shop: it is there, on Zoo Road, and so is everything
              in it.
            </p>
            <div className="film-actions">
              <Link href="/shop" className="btn btn-gold">
                View the collection
              </Link>
              <a
                href={waLink(`Hello ${SHOP.name}, I saw the shop video on your site.`)}
                className="btn btn-line"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap" id="visit">
        <div className="duo">
          <div className="prose">
            <span className="eyebrow">The store</span>
            <h2>Find us on Zoo Road.</h2>
            <p>
              Bargoni sits beside the main gate of the Kano Zoological Garden.
              The full collection is on the floor — shoes on one side, bags on
              the other — and what you see online is what is in the building.
            </p>
            <p>
              If you are travelling in from outside Kano, send a message first
              and we will hold the piece for you, or tell you honestly if the
              size has already gone.
            </p>
            <p>
              We also source to order. If there is a house or a model you want
              that is not listed here, tell us what you are looking for and we
              will find out what it takes to get it.
            </p>
          </div>

          <div className="panel">
            <h3>Visit &amp; contact</h3>
            <p>Walk in, call, or send a message — whichever is easier.</p>
            <ul className="spec" style={{ marginTop: 24 }}>
              <li>
                <span className="k">Address</span>
                <span className="v">{fullAddress()}</span>
              </li>
              <li>
                <span className="k">Open</span>
                <span className="v">{SHOP.hours}</span>
              </li>
              <li>
                <span className="k">Phone</span>
                <span className="v">
                  {SHOP.phones.map((p, i) => (
                    <span key={p}>
                      {i > 0 ? ", " : ""}
                      <a href={`tel:${p}`}>{p}</a>
                    </span>
                  ))}
                </span>
              </li>
              {SHOP.facebook ? (
                <li>
                  <span className="k">Facebook</span>
                  <span className="v">
                    <a href={SHOP.facebook} target="_blank" rel="noopener noreferrer">
                      Bargoni Shoes and Bags
                    </a>
                  </span>
                </li>
              ) : null}
              {SHOP.email ? (
                <li>
                  <span className="k">Email</span>
                  <span className="v">
                    <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
                  </span>
                </li>
              ) : null}
            </ul>
            <div style={{ marginTop: 26 }}>
              <a
                href={waLink(`Hello ${SHOP.name}, I would like to visit the store.`)}
                className="btn btn-gold btn-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
