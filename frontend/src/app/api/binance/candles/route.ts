
import { NextRequest, NextResponse } from "next/server";
import { authenticatedRequest } from "@/lib/apiUtils";



export async function GET(req: NextRequest) {

    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const result = await authenticatedRequest('/binance/candles/sync/chart', 'post', params);
    
    const res = NextResponse.json({ candles: result.data });
    
    if (result.refreshed && result.token) {
        res.cookies.set("auth-token", result.token, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
        });
    }
    
    return res;

}

