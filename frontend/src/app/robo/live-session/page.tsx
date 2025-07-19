"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Play,
    Pause,
    Square,
    Activity,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Clock,
    Zap,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react"

import axios from "axios"

import { LiveSessionType, MetricType } from "./types"

import ListSessionComponent from "./components/listSession"
import MetricsSession from "./components/metricsSession"



const livePositions = [
    {
        id: "pos_001",
        symbol: "BTC/USDT",
        side: "long",
        size: 0.15,
        entryPrice: 42350.75,
        currentPrice: 42580.25,
        pnl: 34.43,
        pnlPercent: 0.54,
        duration: "2h 15m",
    },
    {
        id: "pos_002",
        symbol: "ETH/USDT",
        side: "short",
        size: 1.5,
        entryPrice: 2250.5,
        currentPrice: 2245.75,
        pnl: 7.13,
        pnlPercent: 0.21,
        duration: "45m",
    },
]

const sessionLogs = [
    {
        id: 1,
        timestamp: "2024-01-15T14:32:15Z",
        type: "trade",
        message: "BTC/USDT: Posição longa aberta a $42,350.75",
        level: "info",
    },
    {
        id: 2,
        timestamp: "2024-01-15T14:30:45Z",
        type: "signal",
        message: "RSI Mean Reversion: Sinal de compra gerado para BTC/USDT",
        level: "success",
    },
    {
        id: 3,
        timestamp: "2024-01-15T14:28:30Z",
        type: "order",
        message: "ETH/USDT: Ordem limite de venda executada a $2,245.75",
        level: "info",
    },
    {
        id: 4,
        timestamp: "2024-01-15T14:25:12Z",
        type: "warning",
        message: "MACD Crossover: Win rate abaixo de 40%",
        level: "warning",
    },
]






export default function LiveSession () {


    const [loadingSessions, setLoadingSession] = useState(false);
    const [liveSessions, setLiveSessions] = useState<LiveSessionType[]>([]);

    const [showOnlyRunning, setShowOnlyRunning] = useState(true);
    
    const filteredSessions = showOnlyRunning
        ? liveSessions.filter(session => session.status === 'running') // Se o checkbox estiver marcado
        : liveSessions;
    

    const getSessions = async () => {

        try {
            setLoadingSession(true);
            const sessionsResults = await axios.get('/api/live-session/list')
            setLiveSessions(sessionsResults.data.sessions)
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSession(false);
        }
    }


    useEffect(() => {
        
        getSessions();

    }, []);


    

    const formatCurrency = (value: number, decimals = 2) => {
        return value.toFixed(decimals)
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    }

    const getLogIcon = (level: string) => {
        switch (level) {
        case "success":
            return <CheckCircle2 className="h-3 w-3 text-green-500" />
        case "warning":
            return <AlertTriangle className="h-3 w-3 text-yellow-500" />
        case "error":
            return <AlertTriangle className="h-3 w-3 text-red-500" />
        default:
            return <Activity className="h-3 w-3 text-blue-500" />
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="h-6 w-6" />
                        Live Session
                    </h1>
                    {/* <p className="text-muted-foreground">{currentTime}</p> */}
                </div>
                
            </div>

            

            {/* Live Metrics */}
            <MetricsSession 
                sessions={filteredSessions}
            
            />

            <Tabs defaultValue="strategies" className="space-y-4">

                <TabsList>
                    <TabsTrigger className="cursor-pointer" value="strategies">Estratégias Ativas</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="positions">Posições Live</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="logs">Logs da Sessão</TabsTrigger>
                </TabsList>

                <TabsContent value="strategies" className="space-y-4">
                    <ListSessionComponent 
                        liveSessions={filteredSessions}
                        showOnlyRunning={showOnlyRunning}
                        setShowOnlyRunning={setShowOnlyRunning}
                    />
                </TabsContent>

                <TabsContent value="positions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Posições Abertas</CardTitle>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                            <Table className="table-fixed w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Símbolo</TableHead>
                                        <TableHead>Lado</TableHead>
                                        <TableHead>Tamanho</TableHead>
                                        <TableHead>Preço Entrada</TableHead>
                                        <TableHead>Preço Atual</TableHead>
                                        <TableHead>P&L</TableHead>
                                        <TableHead>%</TableHead>
                                        <TableHead>Duração</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {livePositions.map((position) => (
                                        <TableRow key={position.id}>
                                        <TableCell className="font-mono">{position.symbol}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                            {position.side === "long" ? (
                                                <TrendingUp className="h-3 w-3 text-green-500" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 text-red-500" />
                                            )}
                                            <span
                                                className={`text-xs font-medium ${position.side === "long" ? "text-green-500" : "text-red-500"}`}
                                            >
                                                {position.side === "long" ? "Long" : "Short"}
                                            </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono">{position.size}</TableCell>
                                        <TableCell className="font-mono">{formatCurrency(position.entryPrice, 2)}</TableCell>
                                        <TableCell className="font-mono">{formatCurrency(position.currentPrice, 2)}</TableCell>
                                        <TableCell>
                                            <span className={`font-mono ${position.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                                            {position.pnl >= 0 ? "+" : ""}${formatCurrency(position.pnl)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`font-mono ${position.pnlPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                                            {position.pnlPercent >= 0 ? "+" : ""}
                                            {formatCurrency(position.pnlPercent)}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{position.duration}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="logs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Logs da Sessão</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-3 max-h-96 overflow-auto">

                                {sessionLogs.map((log) => (
                                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                        {getLogIcon(log.level)}
                                        <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-muted-foreground">{formatTime(log.timestamp)}</span>
                                            <Badge variant="outline" className="text-xs">
                                            {log.type}
                                            </Badge>
                                        </div>
                                        <p className="text-sm">{log.message}</p>
                                        </div>
                                    </div>
                                ))}
                                
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}