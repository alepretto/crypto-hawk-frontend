'use client'

import { useState } from "react";
import useWebSocket from "react-use-websocket";


interface OrderBookPriceType{
    bestPriceOn: boolean;
    symbol: string;
    market: string;
    environment: string;
    setBestBidPrice: (valor: number) => void;
    setBestAskPrice: (valor: number) => void;
}

interface OrderBookMessage {
    bookOrder: {
        timestamp: string;
        symbol: string;
        bids: any[];
        asks: any[];
        best_ask: number;
        best_bid: number;
    }
}


export default function OrderBookPrice({ bestPriceOn, symbol, market, environment, setBestAskPrice, setBestBidPrice }: OrderBookPriceType) {


    const socketUrl = !bestPriceOn || !symbol || !market ? null : `${process.env.NEXT_PUBLIC_API_WS_URL}/order-book/${symbol}`

    const { lastJsonMessage } = useWebSocket<OrderBookMessage>(socketUrl, {
        queryParams: {
            market,
            environment
        },
        onOpen: () => console.log('Order Book on'),
        onMessage: () => {
            if (lastJsonMessage && lastJsonMessage.bookOrder) {

                const info = lastJsonMessage.bookOrder;
                // console.log(info)
                setBestAskPrice(info.best_ask);
                setBestBidPrice(info.best_bid);
            }
        },
        onError: (err) => console.error(err),
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000
    })


    return null;
}