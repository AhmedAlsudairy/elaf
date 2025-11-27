import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

const publicRoutes = ["/sign-in", "/sign-up", "/tenders"];
const privateRoutes = ["/settings", "/tenders/add", "/tenders/edit"];

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

  // Check private routes more precisely
  const isPrivateRoute = privateRoutes.some((route) => 
    path === route || path.startsWith(route + "/")
  );
  
  // Check public routes - /tenders is public but not /tenders/add
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/tenders") {
      return path === "/tenders" || (path.startsWith("/tenders/") && !isPrivateRoute);
    }
    return path.startsWith(route);
  });

  // Redirect to sign-in if not authenticated and accessing private route
  if (!userId && isPrivateRoute) {
    const signInUrl = new URL(
      `/${isValidLocale ? locale + "/" : ""}sign-in`,
      request.url
    );
    signInUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Handle user profile checks
  if (userId) {
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId },
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

    if (userProfile && isPublicRoute && path === "/sign-in") {
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