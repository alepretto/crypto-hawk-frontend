import { authenticatedRequest } from "@/lib/apiUtils";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    

    const idBacktest = req.nextUrl.searchParams.get('idBacktest');

    const result = await authenticatedRequest(`/api/v1/backtest/${idBacktest}`, 'get')

    const res = result.status === 404
        ? NextResponse.json({ backtest: null }, { status: result.status })
        : NextResponse.json({ backtest: result.data }, { status: result.status });


    if (result.refreshed && result.token) {
        res.cookies.set('auth-token', result.token, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
        });
    }

    return res;  

}

