"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Search } from "lucide-react"

import ListBacktest from "./components/listBacktest"
import { BacktestType } from "./types"
import axios from "axios"
import { symbol } from "zod"






export default function Backtest () {

    const [backtests, setBacktests] = useState<BacktestType[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchSymbol, setSearchSymbol] = useState("all")
    const [searchStrategy, setSearchStrategy] = useState("all")


    const getBacktest = async (params: object) => {

        try {
            setLoading(true);

            const result = await axios.get('/api/backtest/list', {
                params
            });
            
            const responseBacktest = result.data.tests;
            setBacktests(responseBacktest)
        } catch (err) {

            console.error(err);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        
        const params: { [key: string]: any } = {};

        if (searchSymbol !== 'all') {
            params.symbol = searchSymbol
        }

        if (searchStrategy !== 'all') {
            params.strategy = searchStrategy
        }
        
        
        getBacktest(params)

    }, [searchSymbol, searchStrategy])



    return (
        <div className="space-y-4">

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Backtests</h1>
                <Button>
                <Play className="mr-2 h-4 w-4" />
                    Novo Backtest
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">

                        <div>
                            <label className="pl-2">Symbol</label>
                            <Select  value={searchSymbol} onValueChange={setSearchSymbol}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                                    <SelectItem value="LINKUSDT">LINK/USDT</SelectItem>
                                    <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <label className="pl-2">Strategy</label>
                            <Select  value={searchStrategy} onValueChange={setSearchStrategy}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="sniper">Sniper</SelectItem>
                                    <SelectItem value="candle_wepon">Candle Wepon</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                
            </Card>

            {/* Backtests Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Histórico de Backtests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ListBacktest 
                        backtests={backtests}
                    />
                    
                </CardContent>
            </Card>

        </div>
    )
}