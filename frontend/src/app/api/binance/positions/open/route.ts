import { authenticatedRequest } from "@/lib/apiUtils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    

    const environment = req.nextUrl.searchParams.get('environment');


    const result = await authenticatedRequest('/api/v1/binance/positions/open', 'get', {environment})

    const res = result.status === 404
        ? NextResponse.json({ positions: [] }, { status: 200 })
        : NextResponse.json({ positions: result.data }, { status: result.status });

    
    if (result.refreshed && result.token) {
        res.cookies.set('auth-token', result.token, {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24
        })
    }

    return res;
}


