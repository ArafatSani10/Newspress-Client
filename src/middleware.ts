import { NextRequest } from "next/server";
import { proxy } from "./lib/proxy";

export async function middleware(request: NextRequest) {
    return await proxy(request);
}

export const config = {
    matcher: [
        "/admin-dashboard/:path*",
        "/dashboard/:path*",
    ],
};