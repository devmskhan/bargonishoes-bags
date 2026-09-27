"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { SHOP, activeCategories, categoryLabel } from "@/lib/shop";
import { useCart } from "./CartProvider";

export default function Header({ clerkEnabled }: { clerkEnabled: boolean }) {
  const { count, setOpen } = useCart();
  const categories = activeCategories();

  return (
    <header className="header">
      <div className="wrap header-inner">
        <Link href="/" className="logo" aria-label={`${SHOP.name} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" width={42} height={42} />
          <span>
            <span className="logo-word gold-text">{SHOP.name}</span>
            <span className="logo-sub">{SHOP.tagline}</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          <Link href="/shop">Collection</Link>
          {categories.length > 1
            ? categories.map((c) => (
                <Link key={c} href={`/shop?c=${c}`}>
                  {categoryLabel(c)}
                </Link>
              ))
            : null}
          <Link href="/#visit">Visit</Link>
        </nav>

        <div className="header-actions">
          {clerkEnabled ? (
            <>
              <SignedOut>
                <Link href="/sign-in" className="auth-link">
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/account" className="auth-link">
                  Account
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          ) : null}

          <button
            className="cart-open"
            onClick={() => setOpen(true)}
            aria-label={count === 1 ? "List, 1 item" : `List, ${count} items`}
          >
            List
            <span className="cart-pip num">{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
