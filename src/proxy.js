import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Having a session is all this can decide. Whether that session belongs to an
// admin lives in Mongo, and the admin layout asks the API for it — so this is
// the cheap half of the check, keeping the panel from being served to someone
// with no session at all, and the role check still happens where the record is.
export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    // Clerk's auto-proxy path. Without it the handshake requests it makes to
    // its own endpoints fall outside the matcher and never reach the
    // middleware.
    "/__clerk/:path*",
  ],
};
