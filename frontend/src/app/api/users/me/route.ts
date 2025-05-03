import { NextResponse, NextRequest } from "next/server";

import cryptoHawkApi from "@/lib/cryptoHawk";

import { getRefreshedToken } from "@/lib/apiUtils";


export async function GET(req: NextRequest) {
    
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({error: 'Não Autorizado'}, { status: 401} );
    }
    
    
    let response = await cryptoHawkApi.get('/users/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).catch(err => err.response);

    const res = NextResponse.json({ user: response.data });

    if (response.status === 401) {

        const refreshToken = req.cookies.get('refresh-token')?.value;
        
        if (!refreshToken) {
            return NextResponse.json({error: 'Não Autorizado'}, { status: 401} );
        }

        const newToken = await getRefreshedToken(refreshToken);

        response = await cryptoHawkApi.get('/users/me', {
            headers: {
                'Authorization': `Bearer ${newToken}`
            }
        });
        const res = NextResponse.json({ user: response.data });

        res.cookies.set('auth-token', newToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
        });

        return res;
    }

    
    return res;
}