import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // make sure this path is correct in your project


const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

const publicRoutes = ["/login", "/register", "/tenders"];
const privateRoutes = ["/settings", "/tenders/", "/profile/companyprofiles/"];


function isStaticAsset(path: string) {
  return /\.(svg|png|jpg|jpeg|gif|webp|ttf|woff|woff2|ico)$/i.test(path);
}

export default clerkMiddleware(async (auth, request) => {
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


  if (!userId && isPrivateRoute) {
    const loginUrl = new URL(
      `/${isValidLocale ? locale + "/" : ""}login`,
      request.url
    );
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }


  if (userId) {
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId: userId },
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

    // If user has company profile and tries to access login → redirect home
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
