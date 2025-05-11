'use client';

import { useState } from "react";

import { SelectInput } from "./components/selectInput";

import { CandleChartType } from "./types";

import CandleChartComponent from "./components/candleChart";




export default function RoboPage() {
  
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [symbolOptions, setSymbolOptions] = useState(['BTCUSDT', 'ETHUSDT']);


    const [market, setMarket] = useState('futures');
    const [marketOptions, setMarketOptions] = useState(['futures', 'spot']);

    const [environment, setEnvironment] = useState('testnet');
    const [environmentOptions, setEnvironmentOptions] = useState(['mainnet', 'testnet'])

    const [interval, setInterval] = useState('5m');
    const [intervalOptions, setIntervalOptions] = useState(['1m', '5m', '15m', '1h', '1d']);

    
    const [candles, setCandles] = useState<CandleChartType[]>([]);
    const [loading, setLoading] = useState(true);



    return (
        <div>

            <div className="border border-gray-300 p-4 rounded-lg shadow-sm flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
            
                {/* Título */}
                <div className="w-full md:w-1/2">
                    <h1 className="text-lg font-bold text-gray-800 dark:text-white">{symbol}</h1>
                </div>

                {/* Inputs */}
                <div className="w-full md:w-1/2 flex flex-wrap justify-end gap-4">
                    <SelectInput id="symbol" onChange={setSymbol} value={symbol} options={symbolOptions} />
                    <SelectInput id="interval" onChange={setInterval} value={interval} options={intervalOptions} />
                    <SelectInput id="market" onChange={setMarket} value={market} options={marketOptions} />
                    <SelectInput id="environment" onChange={setEnvironment} value={environment} options={environmentOptions} />
                </div>

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