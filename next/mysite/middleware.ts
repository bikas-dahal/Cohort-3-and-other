import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const url = req.nextUrl;

    console.log(url.pathname);

    // If user is authenticated (has a token) and tries to access login or signup, redirect to home page
    if (token && (
        url.pathname === '/login' ||
        url.pathname === '/signup' ||
        url.pathname.startsWith('/verify')
    )) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // If user is not authenticated and tries to access (protected) routes, redirect to login page
    if (!token && (
        url.pathname.startsWith('/blog')
        // url.pathname.startsWith('/dashboard')
    )) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Allow access if none of the conditions match
    return NextResponse.next();
}

// Define the routes that the middleware should apply to
export const config = {
    matcher: [
        '/login',
        '/signup',
        '/verify/:path*',
        '/',
        '/dashboard/:path*',
        '/blog',
    ],
};
