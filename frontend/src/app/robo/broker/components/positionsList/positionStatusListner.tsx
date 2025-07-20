import axios from "axios";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { PositionType } from ".";

interface PositionStatusListnerProps {

    market: string;
    environment: string;
    setPositions: React.Dispatch<React.SetStateAction<PositionType[]>>;
}


export default function PositionStatusListners({ market, environment, setPositions }: PositionStatusListnerProps ) {


    const [token, setToken] = useState('');

    const refreshToken = async () => {

        try {
            const { data } = await axios.get('/api/users/get-token');
            setToken(data.token);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        refreshToken();
    }, []);

    const urlSocket = token 
        ? `${process.env.NEXT_PUBLIC_API_WS_URL}/api/ws/crypto-hawk/user-socket/positions` 
        : null;

    const { lastJsonMessage } = useWebSocket(urlSocket, {
            queryParams: {
                token,
                market,
                environment
            },
            onOpen: () => console.log('Connected to Position Socket'),
            onMessage: (e: MessageEvent<any>) => {
                const parsed = JSON.parse(e.data);

                // if (parsed.event_type !== 'ORDER_TRADE_UPDATE') return;

                // console.log(parsed);
                const newPosition = parsed as PositionType;
                if (!newPosition?.id_position) return;

                setPositions((prevOrders) => {
                    const exists = prevOrders.some((order) => order.id_position === newPosition.id_position);

                    if (exists) {
                    // Atualiza a ordem existente
                        return prevOrders.map((order) =>
                            order.id_position === newPosition.id_position ? { ...order, ...newPosition } : order
                        );
                    } else {
                        // Adiciona nova ordem
                        return [...prevOrders, newPosition];
                    }
                });
            },
            onError: (err: Event) => {
                console.error('WebSocket error:', err);
            },
            shouldReconnect: (closeEvent) => true,
            reconnectInterval: 3000
    
        });

    return null;
}


