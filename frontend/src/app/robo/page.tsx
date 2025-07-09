'use client';

import { useEffect, useState } from "react";


import { CandleChartType, MiniTickerType } from "./types";

import CandleChartComponent from "./components/candleChart";

import { ChartControls } from './components/menuBot'
import { TradeOrderForm } from "./components/orderForm";
import { OpenOrdersLog } from "./components/orderList";
import { OpenPositionsLog } from "./components/positionsList";
import MiniTickerComponent from "./components/miniTicker";



import { Toaster } from "@/components/ui/sonner";

import Image from "next/image";


interface AssestBalanceType {
    asset: string;
    balance: number;
}


export default function RoboPage() {
  
    const [symbol, setSymbol] = useState('');
    const [symbolOptions, setSymbolOptions] = useState(['BTCUSDT', 'ETHUSDT']);

    const [miniTicker, setMiniTicker] = useState<MiniTickerType>({ close: 0, change_24h: 0, high: 0, low: 0, negociacoes: 0, open: 0, pct_change_24h: 0, symbol: '', timestamp: '"2020-01-01T00:00:00.000000-03:00"' });

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

            <Toaster position="top-right"/>


            <div className="flex justify-between h-30 ">


                <div className="flex h-full w-full ml-6 gap-20">

                    <div className="flex flex-col items-start justify-center">

                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                {symbol} - {interval}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Dados em tempo real obtidos via API da Binance
                        </p>
                    </div>

                    <div className="flex items-center justify-center h-full">
                        {miniTicker && (
                            // <span className="text-xl md:text-2xl font-semibold text-green-500">
                            // U$ {miniTicker.close.toLocaleString('pt-BR')}
                            // </span>
                            <MiniTickerComponent 
                                symbol={symbol}
                                market={market}
                                environment={environment}
                                miniTicker={miniTicker}
                                setMiniTicker={setMiniTicker}
                            />
                        )}
                    </div>

                </div>

                

                <div className="flex items-center justify-center h-full w-150">
                    <Image
                        src="/logo-transparante-2.png"
                        alt="AlgoQuant Logo"
                        width={300}
                        height={30}
                    />
                </div>
            </div>


            <div className="">
                <ChartControls 
                    onSymbolChange={setSymbol}
                    onEnvironmentChange={setEnvironment}
                    onIntervalChange={setInterval}
                    onMarketChange={setMarket}
                    symbol={symbol}
                    interval={interval}
                    market={market}
                    environment={environment}
                />
            </div>

            
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

            


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <OpenPositionsLog 
                    symbol={symbol}
                    environment={environment}
                    market={market}
                    symbolPrice={miniTicker.close}
                />


                <OpenOrdersLog
                    symbol={symbol}
                    market={market}
                    environment={environment}
                />


            </div>



        </div>
    );
}