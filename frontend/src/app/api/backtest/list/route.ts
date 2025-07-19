import { authenticatedRequest } from "@/lib/apiUtils";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
 
    const symbol = req.nextUrl.searchParams.get('symbol');
    const strategy = req.nextUrl.searchParams.get('strategy');

    const params: { [key: string]: any } = {};

    if (strategy) {
        params.strategy = strategy
    }
    if (symbol) {
        params.symbol = symbol
    }


    const result = await authenticatedRequest(`/api/v1/backtest/list`, 'get', params);

    const res = NextResponse.json({tests: result.data.tests}, { status: result.status });


    if (result.refreshed && result.token) {
        res.cookies.set('auth-token', result.token, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
        })
    }

    return res;


}
