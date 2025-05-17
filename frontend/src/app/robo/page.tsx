'use client';

import { useEffect, useState } from "react";


import { CandleChartType } from "./types";

import CandleChartComponent from "./components/candleChart";

import { ChartControls } from './components/menuBot'
import { TradeOrderForm } from "./components/order";


import { Toaster } from "@/components/ui/sonner";



interface AssestBalanceType {
    asset: string;
    balance: number;
}


export default function RoboPage() {
  
    const [symbol, setSymbol] = useState('');
    const [symbolOptions, setSymbolOptions] = useState(['BTCUSDT', 'ETHUSDT']);


    const [baseAsset, setBaseAsset] = useState<AssestBalanceType | null>(null);
    const [quoteAsset, setQuoteAsset] = useState<AssestBalanceType | null>(null);



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
        <div className="space-y-4">

            <div className="">
                <ChartControls 
                    onSymbolChange={setSymbol}
                    onEnvironmentChange={setEnvironment}
                    onIntervalChange={setInterval}
                    onMarketChange={setMarket}
                />
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-2">
                    {/* <TrendingUp className="w-5 h-5 text-green-600" /> */}
                    <h2 className="text-xl font-bold text-foreground">
                    {symbol} - {interval}
                    </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    Dados em tempo real obtidos via API da Binance
                </p>
            </div>
            <Toaster />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="md:col-span-3">
                    
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

                <div className="md:col-span-1">

                    <TradeOrderForm  
                        symbol={symbol}
                        market={market}
                        environment={environment}
                        setBaseAsset={setBaseAsset}
                        setQuoteAsset={setQuoteAsset}
                        baseAsset={baseAsset}
                        quoteAsset={quoteAsset}
                    />

                </div>

            </div>

            


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                


            </div>



        </div>
    );
}