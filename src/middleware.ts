import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if user is logged in (in a real app, this would check JWT token)
    const userSession = request.cookies.get('lotus_session');
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If not logged in and trying to access protected route, redirect to login
    if (!userSession && !isPublicRoute && pathname !== '/') {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If logged in and trying to access login page, redirect to dashboard
    if (userSession && pathname === '/login') {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
