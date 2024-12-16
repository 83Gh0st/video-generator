import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server'; // Ensure NextResponse is imported

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/retrive-data(.*)']); // Match the API route
const isProtectedApiRoute = createRouteMatcher(['/api/retrive-data(.*)']); // Modify as needed

export default clerkMiddleware(async (auth, req) => {
  console.log("Middleware triggered for:", req.url); // Log all incoming requests

  if (isPublicRoute(req)) {
    console.log("Public route, skipping authentication:", req.url);
    return NextResponse.next(); // Continue without any authentication
  }

  // If this is a protected route
  if (isProtectedApiRoute(req)) {
    console.log("Protected route, requiring authentication:", req.url);
    await auth.protect(); // Ensure authentication for protected routes
  }
});

export const config = {
  matcher: [
    '/((?!sign-in|sign-up|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // Make sure the API routes are included here
  ],
};
