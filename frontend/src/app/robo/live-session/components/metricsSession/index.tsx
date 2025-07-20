import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Activity, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

import { LiveSessionType } from "../../types"
import { PositionType } from "@/app/robo/types"

interface ComponentProps {
    sessions: LiveSessionType[];
    positions: PositionType[];
}


export default function MetricsSession({ sessions, positions }: ComponentProps) {


    const totalPnl = sessions.reduce((pnl, sessaoAtual) => {

        const pnlSessao = sessaoAtual.metrics?.total_pnl_gross ?? 0;

        return pnl + pnlSessao
    }, 0)


    const totalTrades = sessions.reduce((trades, session) => {

        const sessionTrade = session.metrics?.total_trades ?? 0;

        return trades + sessionTrade
    }, 0)


    const winTrades = sessions.reduce((ganhos, session) => {

        const ganhosSessao = session.metrics?.win_trades ?? 0

        return ganhos + ganhosSessao
    }, 0)


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-7 w-7 text-muted-foreground" />
                        <div>
                            <div className={`text-2xl font-bold font-mono ${totalPnl >= 0 ? "text-green-500" : "text-red-500"}`} >
                                {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString('PT-BR')}
                            </div>
                            <p className="text-[1.1rem] text-muted-foreground">P&L Total</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-7 w-7 text-muted-foreground" />
                        <div>
                            <div className={`text-2xl font-bold font-mono`} >
                                {positions.length}
                            </div>
                            <p className="text-[1.1rem] text-muted-foreground">Posições Abertas</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <Activity className="h-7 w-7 text-muted-foreground" />
                        <div>
                            <div className="text-2xl font-bold">{totalTrades}</div>
                            <p className="text-[1.1rem] text-muted-foreground">Total Trades</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                    <TrendingUp className="h-7 w-7 text-muted-foreground" />
                    <div>
                        <div className="text-2xl font-bold">{ totalTrades > 0 ? ((winTrades / totalTrades) * 100).toFixed(2) : 0 }%</div>
                        <p className="text-[1.1rem] text-muted-foreground">Win Rate</p>
                    </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
