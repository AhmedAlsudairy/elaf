import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

const publicRoutes = ["/login", "/register", "/tenders"];
const privateRoutes = ["/settings", "/tenders/"];

function isStaticAsset(path: string) {
  return /\.(svg|png|jpg|jpeg|gif|webp|ttf|woff|woff2|ico)$/i.test(path);
}

export default clerkMiddleware(async (auth, request) => {
  // CRITICAL: Skip all middleware for webhooks - return immediately
  if (request.nextUrl.pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  // Skip for static assets
  if (isStaticAsset(request.nextUrl.pathname)) return NextResponse.next();

  let response = intlMiddleware(request);
  const { userId } = auth();

  const locale = request.nextUrl.pathname.split("/")[1];
  const isValidLocale = ["en", "ar"].includes(locale);
  const path = isValidLocale
    ? "/" + request.nextUrl.pathname.split("/").slice(2).join("/")
    : request.nextUrl.pathname;

  const isPrivateRoute = privateRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Redirect to login if not authenticated and accessing private route
  if (!userId && isPrivateRoute) {
    const loginUrl = new URL(
      `/${isValidLocale ? locale + "/" : ""}login`,
      request.url
    );
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle user profile checks
  if (userId) {
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId }, // Changed from clerkId to clerkUserId to match your schema
    });

    if (!userProfile && path !== "/profile/startingprofile") {
      const profileCreationUrl = new URL(
        `/${isValidLocale ? locale + "/" : ""}profile/startingprofile`,
        request.url
      );
      return NextResponse.redirect(profileCreationUrl);
    }

    if (userProfile && path === "/profile/startingprofile") {
      const homeUrl = new URL(
        `/${isValidLocale ? locale + "/" : ""}`,
        request.url
      );
      return NextResponse.redirect(homeUrl);
    }

    if (userProfile && isPublicRoute && path === "/login") {
      const homeUrl = new URL(
        `/${isValidLocale ? locale + "/" : ""}`,
        request.url
      );
      return NextResponse.redirect(homeUrl);
    }
  }

  return response;
});

export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/(api|trpc)(.*)",
  ],
};