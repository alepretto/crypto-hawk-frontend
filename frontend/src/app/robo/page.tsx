'use client';

import { useEffect, useState } from "react";

import { SelectInput } from "./components/selectInput";

import { CandleChartType } from "./types";

import CandleChartComponent from "./components/candleChart";
import CreateOrderComponent from "./components/order";





export default function RoboPage() {
  
    const [symbol, setSymbol] = useState('');
    const [symbolOptions, setSymbolOptions] = useState(['BTCUSDT', 'ETHUSDT']);


    const [market, setMarket] = useState('');
    const [marketOptions, setMarketOptions] = useState(['futures', 'spot']);

    const [environment, setEnvironment] = useState('');
    const [environmentOptions, setEnvironmentOptions] = useState(['mainnet', 'testnet'])

    const [interval, setInterval] = useState('');
    const [intervalOptions, setIntervalOptions] = useState(['1m', '5m', '15m', '1h', '1d']);

    
    const [candles, setCandles] = useState<CandleChartType[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const symbolSaved = localStorage.getItem('symbolDash') || 'BTCUSDT';
        setSymbol(symbolSaved);

        const marketSaved = localStorage.getItem('marketDash') || 'futures';
        setMarket(marketSaved);

        const environmentSaved = localStorage.getItem('environmentDash') || 'testnet';
        setEnvironment(environmentSaved);

        const intervalSaved = localStorage.getItem('intervalDash') || '1d';
        setInterval(intervalSaved);
    }, []);

    useEffect(() => {
        if (symbol !== '') localStorage.setItem('symbolDash', symbol);
        if (market !== '') localStorage.setItem('marketDash', market);
        if (environment !== '') localStorage.setItem('environmentDash', environment);
        if (interval !== '') localStorage.setItem('intervalDash', interval);
    }, [symbol, market, environment, interval]);



    return (
        <div>

            <div className="border border-gray-300 p-4 rounded-lg shadow-sm flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
            
                <div className="w-full md:w-1/2">
                    <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                        {symbol}
                    </h1>
                </div>

                

                <div className="w-full md:w-1/2 flex flex-wrap justify-end gap-4">
                    <SelectInput id="symbol" onChange={setSymbol} value={symbol} options={symbolOptions} />
                    <SelectInput id="interval" onChange={setInterval} value={interval} options={intervalOptions} />
                    <SelectInput id="market" onChange={setMarket} value={market} options={marketOptions} />
                    <SelectInput id="environment" onChange={setEnvironment} value={environment} options={environmentOptions} />
                </div>

            </div>

            <div className="py-5 mr-5 flex items-center justify-end">
                <CreateOrderComponent 
                    symbol={symbol}
                    interval={interval}
                    market={market}
                    environment={environment}
                />
            </div>


            <div>
                <CandleChartComponent 
                    candles={candles}
                    symbol={symbol}
                    interval={interval}
                    market={market}
                    environment={environment}
                    loading={loading}
                    setLoading={setLoading}
                    setCandles={setCandles}
                />
            </div>
        </div>
    );
}