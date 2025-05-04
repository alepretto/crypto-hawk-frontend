'use client';

import { useState } from "react";
import useWebSocket from "react-use-websocket";


interface MiniTickerMessage {
    miniTicker?: any[];
}

export default function RoboPage() {
  

    const [miniTickerState, setMiniTickerState] = useState<any[]>([]);


    const { lastJsonMessage } = useWebSocket<MiniTickerMessage>(`${process.env.NEXT_PUBLIC_API_WS_URL}/mini-ticker`, {
        onOpen: () => console.log('Connected to App WS Server'),
        onMessage: () => {
            if (lastJsonMessage && lastJsonMessage.miniTicker) {

                const newList = lastJsonMessage.miniTicker.filter(item => item.s === 'BTCUSDT')
                setMiniTickerState(newList)
            }
        },
        queryParams: {},
        onError: (err) => console.error(err),
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000
    });

    return (
        <div>
            Olá

            <div>
                {miniTickerState.map((ticker, index) => 
                    <div key={index}>
                        <div>{ticker.s} - {ticker.c}</div>
                    </div>
                )}

            </div>
        </div>
    );
}