// import { createServerClient } from "@supabase/ssr";
// import createMiddleware from "next-intl/middleware";
// import { type NextRequest, NextResponse } from "next/server";
//  const isStaticAsset = (path: string) => {
//       return /\.(svg|png|jpg|jpeg|gif|webp|ttf|woff|woff2)$/i.test(path);
//     };

//     const intlMiddleware = createMiddleware({
//       locales: ["en", "ar"],
//       defaultLocale: "en",
//     });
    
//     const publicRoutes = ['/login', '/register' ];
//     const privateRoutes = [ '/profile', '/settings','/posts'];
// export const updateSession = async (request: NextRequest) => {
//   // This `try/catch` block is only here for the interactive tutorial.
//   // Feel free to remove once you have Supabase connected.
//   try {


  
//     // Create an unmodified response
   
//   if (isStaticAsset(request.nextUrl.pathname)) {
//       return NextResponse.next();
//     }

    
//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           getAll() {
//             return request.cookies.getAll();
//           },
//           setAll(cookiesToSet) {
//             cookiesToSet.forEach(({ name, value }) =>
//               request.cookies.set(name, value),
//             );
//             response = NextResponse.next({
//               request,
//             });
//             cookiesToSet.forEach(({ name, value, options }) =>
//               response.cookies.set(name, value, options),
//             );
//           },
//         },
//       },
//     );

//     // This will refresh session if expired - required for Server Components
//     // https://supabase.com/docs/guides/auth/server-side/nextjs
//     const { data: { user } } = await supabase.auth.getUser();
//     console.log("User authentication status:", user ? "Logged in" : "Not logged in");
  
//     const locale = request.nextUrl.pathname.split('/')[1];
//     const isValidLocale = ['en', 'ar'].includes(locale);
//     const path = isValidLocale ? '/' + request.nextUrl.pathname.split('/').slice(2).join('/') : request.nextUrl.pathname;
//     console.log("Current path:", path);
  
//     const isPrivateRoute = privateRoutes.some(route => path.startsWith(route));
//     const isPublicRoute = publicRoutes.some(route => path.startsWith(route));
//     console.log("Is private route:", isPrivateRoute);
//     console.log("Is public route:", isPublicRoute);
  
//     if (!user && isPrivateRoute) {
//       console.log("Redirecting to login");
//       const loginUrl = new URL(`/${isValidLocale ? locale + '/' : ''}login`, request.url);
//       loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
//       return NextResponse.redirect(loginUrl);
//     }
  
//     return response;
//   } catch (e) {
//     // If you are here, a Supabase client could not be created!
//     // This is likely because you have not set up environment variables.
//     // Check out http://localhost:3000 for Next Steps.
//     return NextResponse.next({
//       request: {
//         headers: request.headers,
//       },
//     });
//   }
// };
