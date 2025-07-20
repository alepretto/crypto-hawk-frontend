import { useState, useEffect } from "react";

import axios from "axios";
import useWebSocket from "react-use-websocket";

import { OrderType } from ".";

interface UserSocketInfo {

    userSocker: any[];
}


interface OrderStatusListnerProps {

    market: string;
    environment: string;
    setOrders: React.Dispatch<React.SetStateAction<OrderType[]>>;
}


export default function OrderStatusListner( { market, environment, setOrders } : OrderStatusListnerProps) {

    const [token, setToken] = useState('');

    const refreshToken = async () => {

        try {
            
            const { data } = await axios.get('/api/users/get-token');
            setToken(data.token);
        } catch (err) {
            console.error(err);
        }

    }
    
    useEffect(() => {
        refreshToken();
    }, []);

    const socketUrl = token 
        ? `${process.env.NEXT_PUBLIC_API_WS_URL}/api/ws/crypto-hawk/user-socket/orders` 
        : null;

    const { lastJsonMessage } = useWebSocket<UserSocketInfo>(socketUrl, {
            queryParams: {
                token,
                market,
                environment
            },
            onOpen: () => console.log('Connected to User Socket'),
            onMessage: (e: MessageEvent<any>) => {
                const parsed = JSON.parse(e.data);

                // if (parsed.event_type !== 'ORDER_TRADE_UPDATE') return;

                console.log(parsed);
                const newOrder = parsed as OrderType;
                if (!newOrder?.id_order) return;

                setOrders((prevOrders) => {
                    const exists = prevOrders.some((order) => order.id_order === newOrder.id_order);

                    if (exists) {
                    // Atualiza a ordem existente
                        return prevOrders.map((order) =>
                            order.id_order === newOrder.id_order ? { ...order, ...newOrder } : order
                        );
                    } else {
                        // Adiciona nova ordem
                        return [...prevOrders, newOrder];
                    }
                });
            },
            onError: (err: Event) => {
                console.error('WebSocket error:', err);
            },
            shouldReconnect: (closeEvent) => true,
            reconnectInterval: 3000

        }
    );


    return null;

}


