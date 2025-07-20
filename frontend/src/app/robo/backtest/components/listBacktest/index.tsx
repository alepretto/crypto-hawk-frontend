import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Eye, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

import { BacktestType } from "../../types"
import { formatDate } from "@/lib/utils"


interface ComponentProps {

    backtests: BacktestType[]
}


export default function ListBacktest({ backtests }: ComponentProps) {



    const formatCurrency = (value: number, decimals = 2) => {
        return value.toFixed(decimals)
    }


    return (
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Estratégia</TableHead>
                        <TableHead className="w-[12%] text-center font-bold text-[1.2rem]">Símbolo</TableHead>
                        <TableHead className="w-[12%] text-center font-bold text-[1.2rem]">Período</TableHead>
                        {/* <TableHead>Duração</TableHead> */}
                        <TableHead className="w-[12%] text-center font-bold text-[1.2rem]">Retorno Total</TableHead>
                        <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Sharpe Ratio</TableHead>
                        <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Max Drawdown</TableHead>
                        <TableHead className="w-[8%] text-center font-bold text-[1.2rem]">Win Rate</TableHead>
                        <TableHead className="w-[8%] text-center font-bold text-[1.2rem]">Trades</TableHead>
                        {/* <TableHead>Status</TableHead> */}
                        <TableHead className="w-[11%] text-center font-bold text-[1.2rem]">Criado em</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {backtests.length > 0 ? (
                        backtests.map((backtest) => (
                            <TableRow key={backtest.id_backtest} className="hover:bg-muted/50">
                                <TableCell className="text-center">{backtest.strategy_name}</TableCell>
                                <TableCell className="text-center font-mono">{backtest.symbol}</TableCell>
                                <TableCell className="text-center text-sm">
                                    {formatDate(backtest.start_time)} - {formatDate(backtest.end_time)}
                                </TableCell>
                                {/* <TableCell>{backtest.duration}</TableCell> */}
                                <TableCell className="text-center">
                                    {backtest.metrics ? (
                                        <div className="flex items-center gap-1 justify-center">
                                            {backtest.metrics.return_pct >= 0 ? (
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                                ) : (
                                                <TrendingDown className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className={`font-mono ${backtest.metrics.return_pct >= 0 ? "text-green-500" : "text-red-500"}`} >
                                                {backtest.metrics.return_pct >= 0 ? "+" : ""}
                                                {formatCurrency(backtest.metrics.return_pct * 100)}%
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    {backtest.metrics ? (
                                        <span className="font-mono">{formatCurrency(backtest.metrics.sharpe_ratio)}</span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    {backtest.metrics ? (
                                        <span className="font-mono text-red-500">{formatCurrency(backtest.metrics.max_drawdown * 100)}%</span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    {backtest.metrics ? (
                                        <span className="font-mono">{formatCurrency(backtest.metrics.win_rate * 100)}%</span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    {backtest.metrics ? (
                                        <span className="font-mono">{backtest.metrics.total_trades}</span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                {/* <TableCell>{getStatusBadge(backtest.status)}</TableCell> */}
                                <TableCell className="text-sm text-center">{formatDate(backtest.metrics?.created_at ?? backtest.start_time)}</TableCell>
                                <TableCell className="text-center">
                                    <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/robo/backtest/${backtest.id_backtest}`}>
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
    );
}