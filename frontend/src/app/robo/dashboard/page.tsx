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


    

    return (
        <div>
            Olá

        </div>
    );
}