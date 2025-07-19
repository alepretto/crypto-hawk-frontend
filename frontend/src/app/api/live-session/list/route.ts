import { authenticatedRequest } from "@/lib/apiUtils";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    

    const params = {

    }

    const result = await authenticatedRequest(`/api/v1/live-session/list`, 'get', params);

    const res = NextResponse.json({ sessions: result.data.sessions }, { status: result.status });

    if (result.refreshed && result.token) {
        res.cookies.set('auth-token', result.token, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: "strict",
            maxAge: 60 * 60 * 24
        });
    }

    return res;
}


