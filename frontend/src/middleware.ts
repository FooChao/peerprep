import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/services/userServiceApi";

// Middleware to protect routes and verify JWT token
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;
    const isAuthRoute = pathname.startsWith("/auth");
    
    // Allow static files (images, icons, etc.)
    const isStaticFile = /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i.test(pathname);
    if (isStaticFile) {
        return NextResponse.next();
    }

    // Allow access to auth routes without token
    if (isAuthRoute) {
        console.log("✅ Auth route - allowing access");
        return NextResponse.next();
    }

    // If no token, redirect to login
    if (!token) {
        const loginUrl = new URL("/auth/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Verify token with backend
        const response = await verifyToken(token);
        
        if (response.status !== 200) {
            // Token is invalid, redirect to login
            const loginUrl = new URL("/auth/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
        
        return NextResponse.next();
    } catch (error) {
        console.error("Token verification failed:", error);
        // On error, redirect to login
        const loginUrl = new URL("/auth/login", request.url);
        return NextResponse.redirect(loginUrl);
    }
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - auth (authentication routes)
         * - api (API routes)
         * - _next (Next.js internals)
         * - favicon.ico
         */
        '/((?!auth|api|_next|favicon.ico).*)',
    ],
}
