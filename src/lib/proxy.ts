import { userService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

const Roles = {
    ADMIN: "ADMIN",
    USER: "USER",
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { data } = await userService.getSession();
  const user = data?.user as { role: string } | undefined;

  if (!user) {
    if (
      pathname.startsWith("/admin-dashboard") ||
      pathname.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  const userRole = user.role;

  if (userRole === Roles.ADMIN) {
    if (
      pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/admin-dashboard")
    ) {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
  }

  if (userRole === Roles.USER) {
    if (pathname.startsWith("/admin-dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// and see matcher go to middleware.ts
