import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, DollarSign, Percent, TrendingDown, TrendingUp } from "lucide-react"


import { BacktestFullType } from "../../../types"
import { formatNumber, formatDate } from "@/lib/utils"




interface ComponentProps {
    backtest: BacktestFullType
}



export default function SummaryTrades({ backtest }: ComponentProps) {

    if (!backtest.metrics) {
        return (
            <h1>Sem métricas</h1>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-8 w-8 text-muted-foreground" />
                        <div>
                            <div className={`text-2xl font-bold ${backtest.metrics.return_pct >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {formatNumber(backtest.metrics.return_pct * 100)}%
                            </div>
                            <p className="text-xm text-muted-foreground">Retorno Total</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
                <div>
                    <div className="text-2xl font-bold">{formatNumber(backtest.metrics.sharpe_ratio)}</div>
                    <p className="text-xm text-muted-foreground">Sharpe Ratio</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <TrendingDown className="h-8 w-8 text-muted-foreground" />
                <div>
                    <div className="text-2xl font-bold text-red-500">{formatNumber(backtest.metrics.max_drawdown * 100)}%</div>
                    <p className="text-xm text-muted-foreground">Max Drawdown</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                <Percent className="h-8 w-8 text-muted-foreground" />
                <div>
                    <div className="text-2xl font-bold">{formatNumber(backtest.metrics.win_rate * 100)}%</div>
                    <p className="text-xm text-muted-foreground">Win Rate</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>
    )
}
