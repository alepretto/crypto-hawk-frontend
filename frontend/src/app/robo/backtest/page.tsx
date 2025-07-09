"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Play, Search, TrendingDown, TrendingUp } from "lucide-react"

const sampleBacktests = [
    {
        id: "bt_001",
        name: "RSI Mean Reversion Strategy",
        strategy: "RSI Mean Reversion",
        symbol: "BTC/USDT",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        duration: "30 dias",
        totalReturn: 15.67,
        sharpeRatio: 1.42,
        maxDrawdown: -8.23,
        winRate: 68.5,
        totalTrades: 127,
        status: "completed",
        createdAt: "2024-02-01T10:30:00Z",
    },
    {
        id: "bt_002",
        name: "MACD Crossover BTC",
        strategy: "MACD Crossover",
        symbol: "BTC/USDT",
        startDate: "2023-12-01",
        endDate: "2024-01-31",
        duration: "61 dias",
        totalReturn: -3.45,
        sharpeRatio: -0.23,
        maxDrawdown: -12.67,
        winRate: 45.2,
        totalTrades: 89,
        status: "completed",
        createdAt: "2024-02-01T09:15:00Z",
    },
    {
        id: "bt_003",
        name: "Bollinger Bands ETH Strategy",
        strategy: "Bollinger Bands",
        symbol: "ETH/USDT",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        duration: "31 dias",
        totalReturn: 22.34,
        sharpeRatio: 1.87,
        maxDrawdown: -5.12,
        winRate: 72.1,
        totalTrades: 156,
        status: "completed",
        createdAt: "2024-02-16T14:20:00Z",
    },
    {
        id: "bt_004",
        name: "Grid Trading SOL",
        strategy: "Grid Trading",
        symbol: "SOL/USDT",
        startDate: "2024-02-01",
        endDate: "2024-02-20",
        duration: "19 dias",
        totalReturn: 8.91,
        sharpeRatio: 0.95,
        maxDrawdown: -6.78,
        winRate: 61.3,
        totalTrades: 203,
        status: "running",
        createdAt: "2024-02-01T16:45:00Z",
    },
    {
        id: "bt_005",
        name: "Moving Average Cross ADA",
        strategy: "MA Crossover",
        symbol: "ADA/USDT",
        startDate: "2024-01-01",
        endDate: "2024-02-01",
        duration: "31 dias",
        totalReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        winRate: 0,
        totalTrades: 0,
        status: "failed",
        createdAt: "2024-02-02T11:30:00Z",
    },
]

export default function Backtest () {

    const [backtests, setBacktests] = useState(sampleBacktests)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredBacktests = backtests.filter((backtest) => {
        const matchesSearch =
        backtest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        backtest.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        backtest.symbol.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || backtest.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR")
    }

    const formatCurrency = (value: number, decimals = 2) => {
        return value.toFixed(decimals)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
        case "completed":
            return <Badge variant="default">Concluído</Badge>
        case "running":
            return <Badge variant="secondary">Executando</Badge>
        case "failed":
            return <Badge variant="destructive">Falhou</Badge>
        default:
            return <Badge variant="outline">{status}</Badge>
        }
    }

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
                    <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Buscar por nome, estratégia ou símbolo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        />
                    </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="running">Executando</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </CardContent>
            </Card>


            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{backtests.length}</div>
                    <p className="text-xs text-muted-foreground">Total de Backtests</p>
                </CardContent>
                </Card>
                <Card>
                <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-500">
                    {backtests.filter((bt) => bt.status === "completed").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Concluídos</p>
                </CardContent>
                </Card>
                <Card>
                <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-500">
                    {backtests.filter((bt) => bt.status === "running").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Em Execução</p>
                </CardContent>
                </Card>
                <Card>
                <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                    {backtests
                        .filter((bt) => bt.status === "completed")
                        .reduce((acc, bt) => acc + bt.totalReturn, 0)
                        .toFixed(2)}
                    %
                    </div>
                    <p className="text-xs text-muted-foreground">Retorno Médio</p>
                </CardContent>
                </Card>
            </div>

            {/* Backtests Table */}
            <Card>
                <CardHeader>
                <CardTitle className="text-lg">Histórico de Backtests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                <div className="overflow-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Estratégia</TableHead>
                        <TableHead>Símbolo</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Retorno Total</TableHead>
                        <TableHead>Sharpe Ratio</TableHead>
                        <TableHead>Max Drawdown</TableHead>
                        <TableHead>Win Rate</TableHead>
                        <TableHead>Trades</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBacktests.length > 0 ? (
                        filteredBacktests.map((backtest) => (
                            <TableRow key={backtest.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{backtest.name}</TableCell>
                            <TableCell>{backtest.strategy}</TableCell>
                            <TableCell className="font-mono">{backtest.symbol}</TableCell>
                            <TableCell className="text-sm">
                                {formatDate(backtest.startDate)} - {formatDate(backtest.endDate)}
                            </TableCell>
                            <TableCell>{backtest.duration}</TableCell>
                            <TableCell>
                                {backtest.status === "completed" ? (
                                <div className="flex items-center gap-1">
                                    {backtest.totalReturn >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                    )}
                                    <span
                                    className={`font-mono ${backtest.totalReturn >= 0 ? "text-green-500" : "text-red-500"}`}
                                    >
                                    {backtest.totalReturn >= 0 ? "+" : ""}
                                    {formatCurrency(backtest.totalReturn)}%
                                    </span>
                                </div>
                                ) : (
                                <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {backtest.status === "completed" ? (
                                <span className="font-mono">{formatCurrency(backtest.sharpeRatio)}</span>
                                ) : (
                                <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {backtest.status === "completed" ? (
                                <span className="font-mono text-red-500">{formatCurrency(backtest.maxDrawdown)}%</span>
                                ) : (
                                <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {backtest.status === "completed" ? (
                                <span className="font-mono">{formatCurrency(backtest.winRate)}%</span>
                                ) : (
                                <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {backtest.status === "completed" ? (
                                <span className="font-mono">{backtest.totalTrades}</span>
                                ) : (
                                <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell>{getStatusBadge(backtest.status)}</TableCell>
                            <TableCell className="text-sm">{formatDate(backtest.createdAt)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild>
                                <Link href={`/robo/backtest/${backtest.id}`}>
                                    <Eye className="h-4 w-4" />
                                </Link>
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                            Nenhum backtest encontrado
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>

        </div>
    )
}