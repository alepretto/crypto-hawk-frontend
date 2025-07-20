"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, DollarSign, Percent, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

import VisaoGeral from "./components/visaoGeral"
import ListTrades from "./components/listTrades"
import SummaryTrades from "./components/summaryBacktest"
import ReturnChart from "./components/returnChart"
import { BacktestFullType } from "../types"
import { capitalizarFrase } from "@/lib/utils"

import axios from "axios"


interface ComponentProps {
    
}


export default function BacktestDetailPage() {
    const params = useParams()
    const router = useRouter()
    const backtestId = params.id as string

    const [loading, setLoading] = useState(false)
    const [backtest, setBacktest] = useState<null | BacktestFullType>(null)


    const getBacktest = async () => {

        try {
            setLoading(true);

            const result = await axios.get(`/api/backtest`, {
                params: {
                    idBacktest: backtestId,
                }
            });

            const data = result.data.backtest;
            console.log(data)
            setBacktest(data);

        } catch(err) {

            console.error(err)

        } finally {
            setLoading(false)
        }

    }
    useEffect(() => {

        getBacktest();

    }, [])

    if (loading) {
        return (
            <h1>Carregando</h1>
        )
    }

    if (!backtest) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h2 className="text-xl font-semibold">Backtest não encontrado</h2>
                <Button asChild>
                <Link href="/robo/backtest">Voltar para Backtests</Link>
                </Button>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR")
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString("pt-BR")
    }

    const formatCurrency = (value: number, decimals = 2) => {
        return value.toFixed(decimals)
    }

    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
            <h1 className="text-2xl font-bold">{capitalizarFrase(backtest.strategy_name)} - {backtest.leverage}x</h1>
            <p className="text-muted-foreground">
                {backtest.symbol} • {backtest.interval}
            </p>
            </div>
            <div className="ml-auto">
                <Badge variant="default">Concluído</Badge>
            </div>
        </div>

        {/* Overview Cards */}

        <SummaryTrades 
            backtest={backtest}
        />

        <ReturnChart 
            backtest={backtest}
        />

        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger className="cursor-pointer" value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="trades">Histórico de Trades</TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="parameters">Parâmetros</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                <VisaoGeral 
                    backtest={backtest}
                />
            </TabsContent>

            <TabsContent value="trades" className="space-y-4">
                <ListTrades 
                    backtest={backtest}
                />
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Parâmetros da Estratégia</CardTitle>
                <CardDescription>Configurações utilizadas no backtest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">Período RSI:</span>
                    <span className="font-mono">{backtest.parameters.rsiPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Nível Sobrevenda:</span>
                    <span className="font-mono">{backtest.parameters.oversoldLevel}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Nível Sobrecompra:</span>
                    <span className="font-mono">{backtest.parameters.overboughtLevel}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Stop Loss:</span>
                    <span className="font-mono">{backtest.parameters.stopLoss}%</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Take Profit:</span>
                    <span className="font-mono">{backtest.parameters.takeProfit}%</span>
                    </div> */}
                </div>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    )
}
