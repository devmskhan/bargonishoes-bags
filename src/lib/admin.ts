/* ============================================================
   Who counts as the admin.

   One email address, set in the ADMIN_EMAIL environment variable and
   never written into the code — this repository is public.

   The password is not here either, and never should be. Clerk holds
   it, hashed, and handles the sign-in, the session cookie and the
   rate limiting. To change who the admin is, change ADMIN_EMAIL and
   create that person in Clerk.
   ============================================================ */

import { currentUser } from "@clerk/nextjs/server";

export const clerkConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export const adminEmail = () =>
  (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();

export const adminConfigured = () => clerkConfigured() && Boolean(adminEmail());

/** The signed-in user's email, lowercased, or null. */
export async function signedInEmail(): Promise<string | null> {
  if (!clerkConfigured()) return null;
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    return email ? email.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

/**
 * True only for the one configured address. Every admin page and every
 * write endpoint calls this — the check lives on the server, so hiding
 * a link in the interface is never what keeps anyone out.
 */
export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const email = await signedInEmail();
  return email !== null && email === adminEmail();
}

/** Standard refusal for the API routes. */
export const denied = () =>
  Response.json({ error: "Not authorised." }, { status: 403 });
