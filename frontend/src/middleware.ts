import { NextRequest, NextResponse } from "next/server";


export function middleware(request: NextRequest) {

    const token = request.cookies.get('auth-token');

    if (!token && request.nextUrl.pathname.startsWith('/robo')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    
    if (token && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/robo', request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/robo/:path*', '/login']
}
