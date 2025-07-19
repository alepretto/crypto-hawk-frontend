import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { BacktestFullType } from "../../../types"
import { formatNumber, formatterCurrency, formatDate, formatarDuracaoDinamica } from "@/lib/utils"







interface ComponentProps {
    backtest: BacktestFullType
}



export default function ListTrades({ backtest }: ComponentProps) {

    if (!backtest.trades_summary) {
        return (
            <h1>
                Sem trades.
            </h1>
        )
    }
    
    return (
        <div>
            <Card>
                <CardHeader>
                <CardTitle>Histórico de Trades</CardTitle>
                <CardDescription>Últimos {backtest.trades_summary.length} trades executados</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                <div className="overflow-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[15%] text-center font-bold text-[1.2rem]">Data</TableHead>
                        <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Lado</TableHead>
                        <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Preço Entrada</TableHead>
                        <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Preço Saída</TableHead>
                        <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Quantidade</TableHead>
                        <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">P&L</TableHead>
                        <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">P&L %</TableHead>
                        <TableHead className="w-[15%] text-center font-bold text-[1.2rem]">Duração</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {backtest.trades_summary.map((trade) => (
                        <TableRow key={trade.id_backtest_trade_summary}>
                            <TableCell className="font-mono text-sm text-center">{formatDate(trade.entry_time)}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={trade.side === "BUY" ? "default" : "secondary"}>
                                    {trade.side === "BUY" ? "Compra" : "Venda"}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-center">{formatterCurrency.format(trade.entry_price)}</TableCell>
                            <TableCell className="font-mono text-center">{formatterCurrency.format(trade.exit_price)}</TableCell>
                            <TableCell className="font-mono text-center">{formatterCurrency.format(trade.amount)}</TableCell>
                            <TableCell className="text-center">
                                <span className={`font-mono ${trade.pnl_gross >= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {trade.pnl_gross >= 0 ? "+" : ""}{formatterCurrency.format(trade.pnl_gross)}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">
                                <span className={`font-mono ${trade.return_pct >= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {trade.return_pct >= 0 ? "+" : ""}
                                    {formatNumber(trade.return_pct * 100)}%
                                </span>
                            </TableCell>
                            <TableCell className="text-center font-mono text-sm">{formatarDuracaoDinamica(trade.seconds_duration)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}