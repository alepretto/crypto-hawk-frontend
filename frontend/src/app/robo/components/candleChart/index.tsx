'use client'

import axios from "axios";

import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

import { SymbolAnalysisType, InfoMessage, CandleInfo } from "../../types";

import CandleChart from "./chart";

import { Loader } from 'lucide-react';


export default function CandleChartComponent({ symbol, interval, market, environment, loading, candles, setCandles, setLoading }: SymbolAnalysisType) {

    const loadCandles = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/binance/candles', {
                params: {
                    symbol: symbol,
                    interval: interval,
                    market: market,
                    environment: environment,
                    // limit: 100
                }
            })
            // console.log(data)
            setCandles(data.candles);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {

        if (!symbol || !interval || !market || !environment) return
        loadCandles();

    }, [symbol, interval, market, environment]);


    const socketUrl = loading ? null : `${process.env.NEXT_PUBLIC_API_WS_URL}/api/ws/crypto-hawk/klines-socket/futures`;
    
    const { lastJsonMessage } = useWebSocket<CandleInfo>(socketUrl, {
        queryParams: {
            market,
            environment,
            symbol,
            interval
        },
        onOpen: () => console.log('Connected to Klines'),
        onMessage: () => {
            if (lastJsonMessage) {

                const candle = lastJsonMessage;
                
                const newCandle = {
                    open_time: Math.floor(new Date(candle.open_time).getTime() /1000),
                    close_time: Math.floor(new Date(candle.close_time).getTime() /1000),
                    open: candle.open,
                    high: candle.high,
                    low: candle.low,
                    close: candle.close,
                    volume: candle.volume,
                }
                // console.log(newCandle)
                setCandles((prevCandles) => {
                    if (!prevCandles.length) return [newCandle];

                    const lastCandle = prevCandles[prevCandles.length - 1];

                    if (lastCandle.open_time === newCandle.open_time) {
                        return [...prevCandles.slice(0, -1), newCandle]
                    } else {
                        return [...prevCandles, newCandle]
                    }
                })
            }
        },
        onError: (err) => console.error(err),
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000,
        
    });


    return (
        <div className="w-full h-[500px] md:h-[500px] lg:h-[650px] bg-zinc-900 rounded-lg overflow-hidden relative">
            
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-zinc-900">
                    <Loader className="h-6 w-6 animate-spin text-gray-300" />
                <span className="text-sm text-gray-400">Carregando dados...</span>
                </div>
            ) : (
                <CandleChart candles={candles} />
            )}
        </div>
    )
}



