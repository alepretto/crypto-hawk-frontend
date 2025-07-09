"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, DollarSign, Percent, TrendingDown, TrendingUp } from "lucide-react"

// Sample detailed backtest data
const sampleBacktestDetails = {
    bt_001: {
        id: "bt_001",
        name: "RSI Mean Reversion Strategy",
        strategy: "RSI Mean Reversion",
        symbol: "BTC/USDT",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        duration: "30 dias",
        initialCapital: 10000,
        finalCapital: 11567,
        totalReturn: 15.67,
        sharpeRatio: 1.42,
        maxDrawdown: -8.23,
        winRate: 68.5,
        totalTrades: 127,
        winningTrades: 87,
        losingTrades: 40,
        avgWin: 2.34,
        avgLoss: -1.87,
        profitFactor: 1.89,
        status: "completed",
        createdAt: "2024-02-01T10:30:00Z",
        parameters: {
        rsiPeriod: 14,
        oversoldLevel: 30,
        overboughtLevel: 70,
        stopLoss: 2.0,
        takeProfit: 4.0,
        },
        trades: [
        {
            id: 1,
            date: "2024-01-02T09:30:00Z",
            side: "buy",
            entryPrice: 42350.75,
            exitPrice: 43120.5,
            quantity: 0.1,
            pnl: 76.98,
            pnlPercent: 1.82,
            duration: "2h 15m",
        },
        {
            id: 2,
            date: "2024-01-03T14:20:00Z",
            side: "sell",
            entryPrice: 43500.25,
            exitPrice: 42890.75,
            quantity: 0.15,
            pnl: 91.43,
            pnlPercent: 1.4,
            duration: "4h 30m",
        },
        {
            id: 3,
            date: "2024-01-05T11:45:00Z",
            side: "buy",
            entryPrice: 41200.0,
            exitPrice: 40850.25,
            quantity: 0.12,
            pnl: -41.97,
            pnlPercent: -0.85,
            duration: "1h 45m",
        },
        {
            id: 4,
            date: "2024-01-08T16:10:00Z",
            side: "buy",
            entryPrice: 40950.5,
            exitPrice: 42100.75,
            quantity: 0.08,
            pnl: 92.02,
            pnlPercent: 2.81,
            duration: "6h 20m",
        },
        {
            id: 5,
            date: "2024-01-10T08:30:00Z",
            side: "sell",
            entryPrice: 42800.25,
            exitPrice: 41950.0,
            quantity: 0.11,
            pnl: 93.53,
            pnlPercent: 1.99,
            duration: "3h 15m",
        },
        ],
    },
}

export default function BacktestDetailPage() {
    const params = useParams()
    const router = useRouter()
    const backtestId = params.id as string

    const backtest = sampleBacktestDetails[backtestId as keyof typeof sampleBacktestDetails]

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
            <h1 className="text-2xl font-bold">{backtest.name}</h1>
            <p className="text-muted-foreground">
                {backtest.strategy} • {backtest.symbol}
            </p>
            </div>
            <div className="ml-auto">
            <Badge variant="default">Concluído</Badge>
            </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="text-2xl font-bold text-green-500">+{formatCurrency(backtest.totalReturn)}%</div>
                    <p className="text-xs text-muted-foreground">Retorno Total</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="text-2xl font-bold">{formatCurrency(backtest.sharpeRatio)}</div>
                    <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="text-2xl font-bold text-red-500">{formatCurrency(backtest.maxDrawdown)}%</div>
                    <p className="text-xs text-muted-foreground">Max Drawdown</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="text-2xl font-bold">{formatCurrency(backtest.winRate)}%</div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="trades">Histórico de Trades</TabsTrigger>
            <TabsTrigger value="parameters">Parâmetros</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Performance Metrics */}
                <Card>
                <CardHeader>
                    <CardTitle>Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Capital Inicial:</span>
                    <span className="font-mono">${formatCurrency(backtest.initialCapital)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Capital Final:</span>
                    <span className="font-mono">${formatCurrency(backtest.finalCapital)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Lucro/Prejuízo:</span>
                    <span className="font-mono text-green-500">
                        +${formatCurrency(backtest.finalCapital - backtest.initialCapital)}
                    </span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Factor:</span>
                    <span className="font-mono">{formatCurrency(backtest.profitFactor)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Trades:</span>
                    <span className="font-mono">{backtest.totalTrades}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Trades Vencedores:</span>
                    <span className="font-mono text-green-500">{backtest.winningTrades}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Trades Perdedores:</span>
                    <span className="font-mono text-red-500">{backtest.losingTrades}</span>
                    </div>
                </CardContent>
                </Card>

                {/* Trade Statistics */}
                <Card>
                <CardHeader>
                    <CardTitle>Estatísticas de Trades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Ganho Médio:</span>
                    <span className="font-mono text-green-500">+{formatCurrency(backtest.avgWin)}%</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Perda Média:</span>
                    <span className="font-mono text-red-500">{formatCurrency(backtest.avgLoss)}%</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Período:</span>
                    <span className="font-mono">
                        {formatDate(backtest.startDate)} - {formatDate(backtest.endDate)}
                    </span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="font-mono">{backtest.duration}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Criado em:</span>
                    <span className="font-mono">{formatDate(backtest.createdAt)}</span>
                    </div>
                </CardContent>
                </Card>
            </div>
            </TabsContent>

            <TabsContent value="trades" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Histórico de Trades</CardTitle>
                <CardDescription>Últimos {backtest.trades.length} trades executados</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                <div className="overflow-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Lado</TableHead>
                        <TableHead>Preço Entrada</TableHead>
                        <TableHead>Preço Saída</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>P&L %</TableHead>
                        <TableHead>Duração</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {backtest.trades.map((trade) => (
                        <TableRow key={trade.id}>
                            <TableCell className="font-mono text-sm">{formatDateTime(trade.date)}</TableCell>
                            <TableCell>
                            <Badge variant={trade.side === "buy" ? "default" : "secondary"}>
                                {trade.side === "buy" ? "Compra" : "Venda"}
                            </Badge>
                            </TableCell>
                            <TableCell className="font-mono">{formatCurrency(trade.entryPrice, 2)}</TableCell>
                            <TableCell className="font-mono">{formatCurrency(trade.exitPrice, 2)}</TableCell>
                            <TableCell className="font-mono">{trade.quantity}</TableCell>
                            <TableCell>
                            <span className={`font-mono ${trade.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {trade.pnl >= 0 ? "+" : ""}${formatCurrency(trade.pnl)}
                            </span>
                            </TableCell>
                            <TableCell>
                            <span className={`font-mono ${trade.pnlPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {trade.pnlPercent >= 0 ? "+" : ""}
                                {formatCurrency(trade.pnlPercent)}%
                            </span>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{trade.duration}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Parâmetros da Estratégia</CardTitle>
                <CardDescription>Configurações utilizadas no backtest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
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
                    </div>
                </div>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    )
}
