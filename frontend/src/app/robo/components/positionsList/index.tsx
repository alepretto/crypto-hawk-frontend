"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Sample data for open positions
const samplePositions = [
  {
    id: "1",
    symbol: "BTC/USDT",
    type: "long",
    entryPrice: 42350.75,
    currentPrice: 42580.25,
    quantity: 0.15,
    pnl: 34.43,
    pnlPercentage: 0.54,
  },
  {
    id: "2",
    symbol: "ETH/USDT",
    type: "short",
    entryPrice: 2250.5,
    currentPrice: 2245.75,
    quantity: 1.5,
    pnl: 7.13,
    pnlPercentage: 0.21,
  },
  {
    id: "3",
    symbol: "SOL/USDT",
    type: "long",
    entryPrice: 105.25,
    currentPrice: 103.5,
    quantity: 10,
    pnl: -17.5,
    pnlPercentage: -1.66,
  },
]

export function OpenPositionsLog() {
    const [positions, setPositions] = useState(samplePositions)

    const closePosition = (id: string) => {
        // In a real app, you would call your API to close the position
        setPositions(positions.filter((position) => position.id !== id))
    }

    return (
        <Card className="h-full">
        <CardHeader className="pb-3">
            <CardTitle className="text-lg">Posições Abertas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="max-h-[300px] overflow-auto">
            <Table>
                <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                    <TableHead className="w-[100px]">Símbolo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Qtd.</TableHead>
                    <TableHead>Preço Entrada</TableHead>
                    <TableHead>Preço Atual</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {positions.length > 0 ? (
                    positions.map((position) => (
                    <TableRow key={position.id}>
                        <TableCell className="font-medium">{position.symbol}</TableCell>
                        <TableCell>
                        <span
                            className={position.type === "long" ? "text-green-500 font-medium" : "text-red-500 font-medium"}
                        >
                            {position.type === "long" ? "Compra" : "Venda"}
                        </span>
                        </TableCell>
                        <TableCell>{position.quantity}</TableCell>
                        <TableCell>{position.entryPrice.toFixed(2)}</TableCell>
                        <TableCell>{position.currentPrice.toFixed(2)}</TableCell>
                        <TableCell>
                        <span className={position.pnl >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                            {position.pnl.toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
                        </span>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => closePosition(position.id)}
                            title="Fechar posição"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        Nenhuma posição aberta
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </div>
        </CardContent>
        </Card>
    )
}
