import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

const privateRoutes = ["/settings", "/tenders/add", "/tenders/edit", "/profile/myprofile", "/profile/companyprofiles"];

function isStaticAsset(path: string) {
  return /\.(svg|png|jpg|jpeg|gif|webp|ttf|woff|woff2|ico)$/i.test(path);
}

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;

  // CRITICAL: Skip all middleware for webhooks - return immediately
  if (pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  // Skip locale logic for API routes (but let Clerk auth run)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Skip static assets
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Apply i18n middleware
  const response = intlMiddleware(request);
  
  const { userId } = await auth();

  const locale = pathname.split("/")[1];
  const isValidLocale = ["en", "ar"].includes(locale);
  const path = isValidLocale
    ? "/" + pathname.split("/").slice(2).join("/")
    : pathname;

  // Check private routes more precisely
  const isPrivateRoute = privateRoutes.some((route) => 
    path === route || path.startsWith(route + "/")
  );

  // Redirect to sign-in if not authenticated and accessing private route
  if (!userId && isPrivateRoute) {
    const signInUrl = new URL(
      `/${isValidLocale ? locale + "/" : ""}sign-in`,
      request.url
    );
    signInUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is logged in and on sign-in page, redirect to home
  if (userId && path === "/sign-in") {
    const homeUrl = new URL(
      `/${isValidLocale ? locale + "/" : ""}`,
      request.url
    );
    return NextResponse.redirect(homeUrl);
  }

  return response;
});

export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};