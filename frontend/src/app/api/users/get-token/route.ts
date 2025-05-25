
import { NextResponse, NextRequest } from "next/server";

import { authenticatedRequest } from "@/lib/apiUtils";

export async function GET(req: NextRequest) {
       
    
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({error: 'Não Autorizado'}, { status: 401} );
    }

    const result = await authenticatedRequest('/api/v1/users/me');
    
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })
    

    const res = NextResponse.json({ token });
    
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