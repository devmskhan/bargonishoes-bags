import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SHOP, fullAddress, activeCategories } from "@/lib/shop";
import { getVisibleCatalogue } from "@/lib/catalogue";
import { isAdmin } from "@/lib/admin";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SHOP.legalName} — Kano`,
    template: `%s — ${SHOP.name}`
  },
  description: `Designer shoes and bags in Kano. Hermès, Dior, Gucci, Prada, Louis Vuitton and more, made from the best materials. ${fullAddress()}.`,
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  openGraph: {
    title: `${SHOP.legalName} — Kano`,
    description:
      "Designer shoes and bags, made from the best materials. Order online, collect on Zoo Road or have it delivered.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#08080A",
  viewportFit: "cover"
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const products = await getVisibleCatalogue();
  const categories = activeCategories(products);
  const admin = await isAdmin();

  const shell = (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Loaded as a plain stylesheet rather than through next/font: the
            Google loader fails at build time on Bodoni Moda's optical-size
            axis, and a broken build is worse than a font request. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,600&family=Jost:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>
        <CartProvider products={products}>
          <Header
            clerkEnabled={clerkEnabled}
            categories={categories}
            isAdmin={admin}
          />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );

  /* Clerk only wraps the app once its keys exist, so the storefront runs
     straight after `npm install` and sign-in switches on when you add them. */
  return clerkEnabled ? <ClerkProvider>{shell}</ClerkProvider> : shell;
}
