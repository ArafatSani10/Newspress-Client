// import { NextRequest } from "next/server";
// import { middleware } from "./lib/proxy";

// export async function proxy(request: NextRequest) {
//   return await middleware(request);
// }

// export const config = {
//   matcher: ["/admin-dashboard/:path*", "/dashboard/:path*"],
// };

import { NextResponse, type NextRequest } from "next/server";

// function isAuthenticated(req: NextRequest) {
//   const secure = req.cookies.get("__Secure-better-auth.session_token")?.value;
//   const normal = req.cookies.get("better-auth.session_token")?.value;
//   const token = secure || normal;

//   return Boolean(token);
// }

export function proxy(req: NextRequest) {
  // const { pathname, search } = req.nextUrl;
  // const authed = isAuthenticated(req);

  // if (pathname === "/login" || pathname === "/signup") {
  //   if (authed) return NextResponse.redirect(new URL("/dashboard", req.url));
  //   return NextResponse.next();
  // }

  // if (pathname.startsWith("/dashboard") && !authed) {
  //   const next = encodeURIComponent(pathname + (search || ""));
  //   return NextResponse.redirect(new URL(`/login?next=${next}`, req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
  ],
};
