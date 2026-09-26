import Link from "next/link";
import { BRANDS, PRODUCTS, SHOP, fullAddress, waLink } from "@/lib/shop";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 8);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <span className="eyebrow">Gucci · Ferragamo · Hermès · and more</span>
            <h1>
              Designer shoes and bags,{" "}
              <span className="gold-text">made from the best materials</span>.
            </h1>
            <p className="lede">
              We stock the houses people actually ask for, and we check every
              piece by hand before it reaches the shelf. Choose yours here,
              collect it on Zoo Road or have it delivered anywhere in Nigeria.
            </p>
            <div className="hero-cta">
              <Link href="/shop" className="btn btn-gold">
                View the collection
              </Link>
              <a
                href={waLink(`Hello ${SHOP.name}, I would like to ask about a piece.`)}
                className="btn btn-line"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask on WhatsApp
              </a>
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
          {BRANDS.map((b) => (
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
              Come to the store and try the size. If you order online in Kano
              and the fit is wrong, we exchange it within seven days, unworn.
            </p>
          </div>
          <div className="assure-item">
            <span className="assure-num">03</span>
            <h3>A person, not a form</h3>
            <p>
              Your order reaches us on WhatsApp and we reply to confirm the
              piece, the price and the delivery before any money moves.
            </p>
          </div>
        </div>
      </div>

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
              <li>
                <span className="k">Email</span>
                <span className="v">
                  <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
                </span>
              </li>
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
