import { NextResponse, NextRequest } from "next/server";
import { authenticatedRequest } from "@/lib/apiUtils";


function formatApiError(rawMessage: string) {
    const regex = /APIError\(code=(-?\d+)\): (.+)/;
    const match = rawMessage.match(regex);

    if (match) {
        const [, code, message] = match;
        return {
            code,
            message
        };
    }

    return rawMessage; // fallback
}


export async function POST(req: NextRequest) {
    
    const body = await req.json();

    const bodyOrder = {
        symbol : body.symbol,
        quantity : body.quantity,
        price : body.price,
        stopLossPrice : body.stopLoss,
        takeProfitPrice : body.takeProfit,
        type : body.orderType.toUpperCase(),
        side : body.orderSide.toUpperCase(),
    }
    
    const market = body.market
    const environment = body.environment

    const result = await authenticatedRequest(`/binance/orders/${market}`, 'post', 
        {environment},
        bodyOrder
    );

    // console.log(result)
    // console.log(result.status)

    let log;
    if (result.status === 200) {
        log = { msg: `Ordem Executada Com Sucesso!!` }
    } else {
        log = {
            msg: formatApiError(result.error?.data.detail)
        }
    }
    const res = NextResponse.json(log, { status: result.status});
    
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

