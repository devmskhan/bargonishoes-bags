import Link from "next/link";
import { SHOP, fullAddress, waLink } from "@/lib/shop";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h4>{SHOP.legalName}</h4>
            <p style={{ maxWidth: "34ch" }}>
              Designer shoes and bags, selected piece by piece and sold from our
              store on Zoo Road. Every item is checked in person before it goes
              on the shelf.
            </p>
          </div>

          <div>
            <h4>Visit</h4>
            <ul>
              <li>{SHOP.address.street}</li>
              <li>
                {SHOP.address.city}, {SHOP.address.state}
              </li>
              <li>{SHOP.hours}</li>
            </ul>
          </div>

          <div>
            <h4>Reach us</h4>
            <ul>
              {SHOP.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p}`}>{p}</a>
                </li>
              ))}
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              {SHOP.facebook ? (
                <li>
                  <a href={SHOP.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </li>
              ) : null}
              {SHOP.instagram ? (
                <li>
                  <a
                    href={`https://instagram.com/${SHOP.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{SHOP.instagram}
                  </a>
                </li>
              ) : null}
              {SHOP.email ? (
                <li>
                  <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <span>
            &copy; {new Date().getFullYear()} {SHOP.legalName}. {fullAddress()}.
          </span>
          <span className="footer-links">
            <Link href="/shop">Collection</Link>
            <Link href="/admin" className="staff-link">
              Admin
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
