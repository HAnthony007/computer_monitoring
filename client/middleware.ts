import { User } from "@/types/User";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const sessionCookie = req.cookies.get("JSESSIONID");

    if (!sessionCookie)
        return NextResponse.redirect(new URL("/login", req.url));

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}auth/me`,
            {
                method: "GET",
                headers: {
                    Cookie: `JSESSIONID=${sessionCookie.value}`,
                },
                credentials: "include",
            }
        );

        if (!res.ok) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const user: User = await res.json();

        const pathname = req.nextUrl.pathname;
        const expectedRoute = `/${user.role}/dashboard`;

        if (!pathname.startsWith(expectedRoute)) {
            return NextResponse.redirect(new URL(expectedRoute, req.url));
        }
    } catch (error) {
        console.error("Error checking session middleware:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*", "/employee/:path*"],
};
