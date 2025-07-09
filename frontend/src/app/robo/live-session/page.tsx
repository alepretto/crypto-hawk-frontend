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


const initialSessionData = {
    isActive: false,
    startTime: null as Date | null,
    duration: "00:00:00",
    totalPnL: 0,
    dailyPnL: 0,
    totalTrades: 0,
    winRate: 0,
    activeStrategies: 0,
    activePositions: 0,
    activeOrders: 0,
}



const activeStrategies = [
    {
        id: "str_001",
        name: "RSI Mean Reversion",
        symbol: "BTC/USDT",
        status: "running",
        pnl: 234.56,
        trades: 12,
        winRate: 75.0,
        lastSignal: "2024-01-15T14:30:00Z",
    },
    {
        id: "str_002",
        name: "MACD Crossover",
        symbol: "ETH/USDT",
        status: "running",
        pnl: -45.23,
        trades: 8,
        winRate: 37.5,
        lastSignal: "2024-01-15T14:25:00Z",
    },
    {
        id: "str_003",
        name: "Grid Trading",
        symbol: "SOL/USDT",
        status: "paused",
        pnl: 89.12,
        trades: 24,
        winRate: 62.5,
        lastSignal: "2024-01-15T13:45:00Z",
    },
]

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

    const [sessionData, setSessionData] = useState(initialSessionData)
    const [currentTime, setCurrentTime] = useState(new Date())

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentTime(new Date())

        // Update session duration if active
        if (sessionData.isActive && sessionData.startTime) {
            const duration = new Date().getTime() - sessionData.startTime.getTime()
            const hours = Math.floor(duration / (1000 * 60 * 60))
            const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((duration % (1000 * 60)) / 1000)

            setSessionData((prev) => ({
            ...prev,
            duration: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
            }))
        }
        }, 1000)

        return () => clearInterval(timer)
    }, [sessionData.isActive, sessionData.startTime])

    // Simulate live data updates
    useEffect(() => {
        if (!sessionData.isActive) return

        const dataTimer = setInterval(() => {
        setSessionData((prev) => ({
            ...prev,
            totalPnL: prev.totalPnL + (Math.random() - 0.5) * 10,
            dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 5,
            totalTrades: prev.totalTrades + (Math.random() > 0.95 ? 1 : 0),
            winRate: Math.max(0, Math.min(100, prev.winRate + (Math.random() - 0.5) * 2)),
            activeStrategies: activeStrategies.filter((s) => s.status === "running").length,
            activePositions: livePositions.length,
            activeOrders: Math.floor(Math.random() * 5) + 2,
        }))
        }, 2000)

        return () => clearInterval(dataTimer)
    }, [sessionData.isActive])

    const startSession = () => {
        setSessionData((prev) => ({
        ...prev,
        isActive: true,
        startTime: new Date(),
        activeStrategies: activeStrategies.filter((s) => s.status === "running").length,
        activePositions: livePositions.length,
        activeOrders: 3,
        }))
    }

    const pauseSession = () => {
        setSessionData((prev) => ({
        ...prev,
        isActive: false,
        }))
    }

    const stopSession = () => {
        setSessionData({
        ...initialSessionData,
        totalPnL: sessionData.totalPnL,
        dailyPnL: sessionData.dailyPnL,
        totalTrades: sessionData.totalTrades,
        winRate: sessionData.winRate,
        })
    }

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
            <p className="text-muted-foreground">{currentTime.toLocaleString("pt-BR")}</p>
            </div>
            <div className="flex gap-2">
            {!sessionData.isActive ? (
                <Button onClick={startSession} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" />
                Iniciar Sessão
                </Button>
            ) : (
                <>
                <Button variant="outline" onClick={pauseSession}>
                    <Pause className="mr-2 h-4 w-4" />
                    Pausar
                </Button>
                <Button variant="destructive" onClick={stopSession}>
                    <Square className="mr-2 h-4 w-4" />
                    Parar
                </Button>
                </>
            )}
            </div>
        </div>

        {/* Session Status */}
        <Card>
            <CardContent className="pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div
                    className={`w-3 h-3 rounded-full ${sessionData.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                    />
                    <span className="font-medium">Status: {sessionData.isActive ? "Ativo" : "Inativo"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{sessionData.duration}</span>
                </div>
                </div>
                <Badge variant={sessionData.isActive ? "default" : "secondary"}>
                {sessionData.isActive ? "LIVE" : "STOPPED"}
                </Badge>
            </div>
            </CardContent>
        </Card>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div
                    className={`text-2xl font-bold font-mono ${sessionData.totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                    {sessionData.totalPnL >= 0 ? "+" : ""}${formatCurrency(sessionData.totalPnL)}
                    </div>
                    <p className="text-xs text-muted-foreground">P&L Total</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div
                    className={`text-2xl font-bold font-mono ${sessionData.dailyPnL >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                    {sessionData.dailyPnL >= 0 ? "+" : ""}${formatCurrency(sessionData.dailyPnL)}
                    </div>
                    <p className="text-xs text-muted-foreground">P&L Diário</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="text-2xl font-bold">{sessionData.totalTrades}</div>
                    <p className="text-xs text-muted-foreground">Total Trades</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="text-2xl font-bold">{formatCurrency(sessionData.winRate)}%</div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>

        <Tabs defaultValue="strategies" className="space-y-4">
            <TabsList>
            <TabsTrigger value="strategies">Estratégias Ativas</TabsTrigger>
            <TabsTrigger value="positions">Posições Live</TabsTrigger>
            <TabsTrigger value="logs">Logs da Sessão</TabsTrigger>
            </TabsList>

            <TabsContent value="strategies" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle className="text-lg">Estratégias em Execução</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Símbolo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Trades</TableHead>
                        <TableHead>Win Rate</TableHead>
                        <TableHead>Último Sinal</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {activeStrategies.map((strategy) => (
                        <TableRow key={strategy.id}>
                        <TableCell className="font-medium">{strategy.name}</TableCell>
                        <TableCell className="font-mono">{strategy.symbol}</TableCell>
                        <TableCell>
                            <Badge variant={strategy.status === "running" ? "default" : "secondary"}>
                            {strategy.status === "running" ? "Executando" : "Pausada"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <span className={`font-mono ${strategy.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {strategy.pnl >= 0 ? "+" : ""}${formatCurrency(strategy.pnl)}
                            </span>
                        </TableCell>
                        <TableCell className="font-mono">{strategy.trades}</TableCell>
                        <TableCell className="font-mono">{formatCurrency(strategy.winRate)}%</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatTime(strategy.lastSignal)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="positions" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle className="text-lg">Posições Abertas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                <Table>
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