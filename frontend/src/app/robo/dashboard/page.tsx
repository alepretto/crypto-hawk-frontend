'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";


interface UserSocketInfo {

    userSocker: any[];
}


export default function RoboDashPage() {

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
        ? `${process.env.NEXT_PUBLIC_API_WS_URL}/user-socket` 
        : null;

    const socketOptions = token ? {
        onOpen: () => console.log('Connected to App WS Server'),
        onMessage: (e: MessageEvent<any>) => {
            const parsed = JSON.parse(e.data);
            if (parsed?.userSocker) {
                console.log(parsed.userSocker);
            }
        },
        queryParams: {
            token,
            market: 'futures',
            environment: 'testnet'
        },
        onError: (err: Event) => {
            console.error('WebSocket error:', err);
        },
        shouldReconnect: () => true,
        reconnectInterval: 3000
    } : undefined;

    const { lastJsonMessage } = useWebSocket<UserSocketInfo>(
        socketUrl,
        socketOptions
    );

    return (
        <div>
            Olá

        </div>
    );
}