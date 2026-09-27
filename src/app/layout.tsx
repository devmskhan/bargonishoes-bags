import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SHOP, fullAddress, activeCategories } from "@/lib/shop";
import { getVisibleCatalogue } from "@/lib/catalogue";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap"
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: `${SHOP.legalName} — Kano`,
    template: `%s — ${SHOP.name}`
  },
  description: `Designer shoes and bags in Kano. Gucci, Ferragamo, Hermès and more, made from the best materials. ${fullAddress()}.`,
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

  const shell = (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider products={products}>
          <Header clerkEnabled={clerkEnabled} categories={categories} />
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
