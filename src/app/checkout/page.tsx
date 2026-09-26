import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Place your order with Bargoni Shoes and Bags, Zoo Road, Kano."
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  let defaultName = "";
  let defaultEmail = "";

  /* Prefill from the signed-in customer when Clerk is configured. */
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    try {
      const { currentUser } = await import("@clerk/nextjs/server");
      const user = await currentUser();
      if (user) {
        defaultName = [user.firstName, user.lastName].filter(Boolean).join(" ");
        defaultEmail = user.primaryEmailAddress?.emailAddress ?? "";
      }
    } catch {
      /* not signed in, or Clerk unreachable — the form just starts empty */
    }
  }

  return <CheckoutForm defaultName={defaultName} defaultEmail={defaultEmail} />;
}
