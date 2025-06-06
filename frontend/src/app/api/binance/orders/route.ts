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
        stopPrice : body.stopLoss,
        profitPrice : body.takeProfit,
        type : body.orderType.toUpperCase(),
        side : body.orderSide.toUpperCase(),
        strategy: 'Broker Front'
    }
    
    const market = body.market
    const environment = body.environment

    const url = market === 'spot'
        ? `/api/v1/binance/orders/${market}`
        : `/api/v1/binance/positions`;

    const result = await authenticatedRequest(url, 'post', 
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


export async function GET(req: NextRequest) {


    const environment = req.nextUrl.searchParams.get('environment');
    const market = req.nextUrl.searchParams.get('market');
    const symbol = req.nextUrl.searchParams.get('symbol');


    const url = `/api/v1/binance/orders/${market}/open`
    const result = await authenticatedRequest(url, 'get', {
        environment,
        symbol
    });

    const res = result.status === 404 
        ? NextResponse.json({ orders: [] }, { status: 200}) 
        : NextResponse.json({ orders: result.data }, { status: result.status});

    
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

export async function DELETE(req: NextRequest) {

    const environment = req.nextUrl.searchParams.get('environment');
    const market = req.nextUrl.searchParams.get('market');
    const symbol = req.nextUrl.searchParams.get('symbol');
    const orderId = req.nextUrl.searchParams.get('orderId');


    const url = `/api/v1/binance/orders/${market}/${orderId}`
    const result = await authenticatedRequest(url, 'delete', {
        environment,
        symbol
    });

    const res = NextResponse.json({ orders: result.data }, { status: result.status});
    
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
