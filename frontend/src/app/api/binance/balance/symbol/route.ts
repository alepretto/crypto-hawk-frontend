
import { authenticatedRequest } from "@/lib/apiUtils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const result = await authenticatedRequest(`/binance/balance/symbol`, 'get', params);


    const res = NextResponse.json({ balance: result.data });
    
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

