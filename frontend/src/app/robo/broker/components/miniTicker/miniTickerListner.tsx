import useWebSocket from "react-use-websocket";

import { MiniTickerType } from "../../types";

interface MiniTickerListnetProps {
    symbol: string;
    market: string;
    environment: string;
    setMiniTicker: React.Dispatch<React.SetStateAction<MiniTickerType>>;
}



export default function MiniTickerListner({ symbol, market, environment, setMiniTicker }: MiniTickerListnetProps) {


    const urlSocket = !symbol || !market || !environment
        ? null
        : `${process.env.NEXT_PUBLIC_API_WS_URL}/api/ws/binance/mini-ticker`;

    const { lastJsonMessage } = useWebSocket(urlSocket, {

        queryParams: {
            symbol,
            market,
            environment
        },
        onOpen: () => console.log('Connect to mini ticker-socker'),
        onMessage: event => {
            const parsed = JSON.parse(event.data);

            setMiniTicker(parsed.miniTicker);
        },
        onError: err => console.error(`Error Mini Ticker Socket`, err),
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000
    });


    return null;
}





