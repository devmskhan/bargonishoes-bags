import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher(["/account(.*)"]);

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

/* Without Clerk keys the storefront still runs; requests simply pass through. */
const passthrough = (_req: NextRequest) => NextResponse.next();

const guarded = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export default clerkEnabled ? guarded : passthrough;

export const config = {
  matcher: [
    /* everything except Next internals and static files */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
