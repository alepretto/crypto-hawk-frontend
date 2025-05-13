'use client'

import { useState } from "react";
import useWebSocket from "react-use-websocket";


interface OrderBookPriceType{
    symbol: string;
    market: string;
    environment: string;
    bestBidPrice: number;
    bestAskPrice: number;
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


export default function OrderBookPrice({ symbol, market, environment, bestAskPrice, bestBidPrice, setBestAskPrice, setBestBidPrice }: OrderBookPriceType) {


    const socketUrl = !symbol || !market ? null : `${process.env.NEXT_PUBLIC_API_WS_URL}/order-book/${symbol}`

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


    return (
        <div className="flex flex-col justify-around space-y-1 text-right">
            
            <label className="block text-sm font-medium text-gray-700">Mark Price</label>

            <div className="flex items-center justify-around">
                <span className="text-green-600 font-bold">Bid: </span>
                <span className="text-green-500 font-semibold">
                    U$ {
                        bestBidPrice ? bestBidPrice.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                        }) : '-'
                        }
                </span>
            </div>

            <div className="flex items-center justify-around">
                <span className="font-bold text-red-600">Ask: </span>
                <span className="text-red-400 font-semibold">
                    U$ {
                        bestAskPrice ? bestAskPrice.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                        }) : '-'
                    }
                </span>
            </div>

        </div>
    );
}