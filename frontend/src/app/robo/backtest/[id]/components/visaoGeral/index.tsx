import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { BacktestFullType } from "../../../types"
import { formatterCurrency, formatNumber, formatDate, formatarDuracaoDinamica } from "@/lib/utils"



interface ComponentProps {
    backtest: BacktestFullType
}


export default function VisaoGeral({ backtest }: ComponentProps) {


    if (!backtest.metrics) {

        return (
            <h1>Sem Métricas</h1>
        )
    }

    if (backtest.trades_summary && backtest.trades_summary.length > 0) {

    }
    
    const duracaoMedia = backtest.trades_summary && backtest.trades_summary.length > 0
        ? backtest.trades_summary.reduce((total, trade) => {
            const duracao = trade.seconds_duration;
            return duracao + total
        }, 0) / backtest.trades_summary.length
        : 0;





    const listaPerdas = backtest.trades_summary && backtest.trades_summary.length > 0
        ? backtest.trades_summary.filter((trade) => {
            return trade.pnl_gross <= 0
        })
        : []

    const perdaMedia = listaPerdas.length > 0
        ? listaPerdas.reduce((total, trade) => {
            const perda = trade.pnl_gross
            return total - perda
        }, 0) / listaPerdas?.length
        : 0
    
    
    const listaGanhos = backtest.trades_summary && backtest.trades_summary.length > 0
        ? backtest.trades_summary.filter((trade) => {
            return trade.pnl_gross > 0
        })
        : []

    const ganhoMedio = listaGanhos.length > 0
        ? listaGanhos.reduce((total, trade) => {
            const ganho = trade.pnl_gross
            return total + ganho
        }, 0) / listaGanhos.length
        : 0




    return (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Performance Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle>Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Capital Inicial:</span>
                        <span className="font-mono">${formatNumber(0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Capital Final:</span>
                        <span className="font-mono">${formatNumber(0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Lucro/Prejuízo:</span>
                        <span className="font-mono text-green-500">
                            +{formatterCurrency.format(backtest.metrics.total_pnl_gross)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Alavangem:</span>
                        <span className="font-mono">{backtest.leverage}X</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total de Trades:</span>
                        <span className="font-mono">{backtest.metrics.total_trades}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Trades Vencedores:</span>
                        <span className="font-mono text-green-500">{backtest.metrics.win_trades}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Trades Perdedores:</span>
                        <span className="font-mono text-red-500">{backtest.metrics.lose_trades}</span>
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
                        <span className="font-mono text-green-500">{formatterCurrency.format(ganhoMedio)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Perda Média:</span>
                        <span className="font-mono text-red-500">{formatterCurrency.format(perdaMedia)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Período:</span>
                        <span className="font-mono">
                            {formatDate(backtest.start_time)} - {formatDate(backtest.end_time)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Duração Média:</span>
                        <span className="font-mono">{formatarDuracaoDinamica(duracaoMedia)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Criado em:</span>
                        <span className="font-mono">{formatDate(backtest.metrics.created_at)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
