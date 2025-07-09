import { NextResponse, NextRequest } from "next/server";
import { authenticatedRequest } from "@/lib/apiUtils";




export async function GET(req: NextRequest) {
    
    const symbol = req.nextUrl.searchParams.get('symbol');
    const environment = req.nextUrl.searchParams.get('environment');
    const market = req.nextUrl.searchParams.get('market');

    const result = await authenticatedRequest(`/api/v1/binance/positions/list`, 'get',
        {
            symbol,
            environment
        }
    )

    const res = result.status === 404 
        ? NextResponse.json({ positions: [] }, { status: 200}) 
        : NextResponse.json({ positions: result.data.positions }, { status: result.status});
    
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

export async function PUT(req: NextRequest) {
    
    const id_position = req.nextUrl.searchParams.get('id_position');
    const environment = req.nextUrl.searchParams.get('environment');
    // const market = req.nextUrl.searchParams.get('market');

    const result = await authenticatedRequest(`/api/v1/binance/positions/${id_position}`, 'put',
        {
            environment
        }
    )

    const res = NextResponse.json({ position: result.data }, { status: result.status});
    
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


