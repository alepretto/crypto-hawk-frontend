import { NextResponse } from "next/server";


export async function POST() {
    
    const res = NextResponse.json({ message: "Logout success" });

    res.cookies.set('auth-token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    })

    res.cookies.set('refresh-token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return res;
}