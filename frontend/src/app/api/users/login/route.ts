import { NextRequest, NextResponse } from "next/server";
import cryptoHawkApi from "@/lib/cryptoHawk";


export async function POST(req: NextRequest) {
    
    const { email, password } = await req.json();

    const { data } = await cryptoHawkApi.post('/api/v1/auth/login', { email, password });

    const res = NextResponse.json({ success: true});
    
    res.cookies.set('auth-token', data.access_token, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24
    });


    res.cookies.set('refresh-token', data.refresh_token, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
    });


    return res
}


