import axios from "axios";

import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

import { SymbolAnalysisType, InfoMessage } from "../../types";

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

        loadCandles();

    }, [symbol, interval, market, environment]);


    const socketUrl = loading ? null : `${process.env.NEXT_PUBLIC_API_WS_URL}/klines/${symbol}/${interval}`;

    const { lastJsonMessage } = useWebSocket<InfoMessage>(socketUrl, {
        onOpen: () => console.log('Connected to App WS Server'),
        onMessage: () => {
            if (lastJsonMessage && lastJsonMessage.info) {

                const info = lastJsonMessage.info;

                const newCandle = {
                    open_time: info.candle.open_time,
                    close_time: info.candle.close_time,
                    open: info.candle.open,
                    high: info.candle.high,
                    low: info.candle.low,
                    close: info.candle.close,
                    volume: info.candle.volume,
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
        queryParams: {
            market
        },
        onError: (err) => console.error(err),
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000,
        
    });


    return (
        <div className="my-5 w-full h-[400px] md:h-[500px] lg:h-[600px] bg-zinc-900 rounded-lg overflow-hidden relative">
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



