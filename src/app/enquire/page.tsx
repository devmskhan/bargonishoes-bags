import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Enquire",
  description:
    "Ask Bargoni Shoes and Bags, Zoo Road Kano, for prices and availability."
};

export const dynamic = "force-dynamic";

export default async function EnquirePage() {
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

  return <EnquiryForm defaultName={defaultName} defaultEmail={defaultEmail} />;
}
