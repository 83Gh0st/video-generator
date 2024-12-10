import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Matchers for public and protected routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  console.log("Middleware triggered for:", req.url);

  if (!isPublicRoute(req) && isProtectedRoute(req)) {
    console.log("Protected route, requiring authentication:", req.url);
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip public routes and static files
    '/((?!sign-in|sign-up|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always apply middleware for API routes
    '/(api|trpc)(.*)',
  ],
};
