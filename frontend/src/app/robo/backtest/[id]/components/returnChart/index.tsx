import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UTCTimestamp } from "lightweight-charts";
import ReturnLineChart from "./chart"

import { BacktestFullType } from "../../../types"

interface ComponentProps {
    backtest: BacktestFullType
}


export default function ReturnChart({ backtest }: ComponentProps) {
    
    if (!backtest.trades_summary) {
        return (
            <div>
                <h1> Sem trades </h1>
            </div>
        )
    }
    

    const initialPoint = {
        time: (new Date(backtest.trades_summary[0].entry_time).getTime() / 1000) as UTCTimestamp,
        value: 0 //
    }
    const tradesPoints = backtest.trades_summary.map(trade => ({
        time: new Date(trade.exit_time).getTime() / 1000 as UTCTimestamp,
        value: (trade.return_accum - 1) * 100
    }))

    const dataChart = [initialPoint, ...tradesPoints]

    const dataChartFinal = dataChart.reduce((acc, currentPoint) => {
        
        const lastPoint = acc.length > 0 ? acc[acc.length - 1] : null;

        if (lastPoint && currentPoint.time <= lastPoint.time) {
            currentPoint.time = lastPoint.time + 1 as UTCTimestamp;
        }

        acc.push(currentPoint);
        return acc;

    }, [] as typeof dataChart);
    
    return (
        <div>
            <Card>
                
                <CardHeader>
                    <CardTitle>Retorno Acumulado</CardTitle>
                    <CardDescription>Evolução do retorno percentual ao longo dos trades</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="w-full h-[400px]">
                        <ReturnLineChart 
                            data={dataChartFinal}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}