"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import axios from "axios"

import PositionStatusListners from "./positionStatusListner"
import { formatDate } from "@/lib/utils"

import { PositionType } from "../../types"


interface PositionLogProps {
    symbol: string;
    market: string;
    environment: string;
    symbolPrice: number;
}


export function OpenPositionsLog({ symbol, market, environment, symbolPrice }: PositionLogProps) {

    const [positions, setPositions] = useState<PositionType[]>([])
    const [showClosed, setShowClosed] = useState(false);


    const closePosition = async (id: number) => {
        
        try {
            const { data } = await axios.put('/api/binance/positions', {}, {
                params: {
                    id_position: id,
                    environment
                }
            })

            const newPosition = data.position;

            setPositions((prevOrders) => {
                const exists = prevOrders.some((order) => order.id_position === newPosition.id_position);

                if (exists) {
                    return prevOrders.map((order) =>
                        order.id_position === newPosition.id_position ? { ...order, ...newPosition } : order
                    );
                } else {
                    return [...prevOrders, newPosition];
                }
            });

        } catch (err) {
            console.error(err)
        }

    }

    const getPositions = async () => {
        if (!symbol || !environment || !market) return null;

        try {
            const { data } = await axios.get(`/api/binance/positions`, {
                params: {
                    symbol,
                    environment,
                    market
                }
            });
            // console.log(data)
            setPositions(data.positions);
        } catch(err) {
            
            console.log(err)

        } 

    }

    useEffect(() => {
        getPositions()

    }, [symbol, market, environment]);

    useEffect(() => {
        if (!symbolPrice || positions.length === 0) return;

        const updatedPositions = positions.map((position) => {
            if (position.status === 'CLOSED') return position;

            const entry = position.entry_price || 0;

            return {
                ...position,
                entry_price: entry,
                pnl: position.side === 'BUY'
                    ? (symbolPrice - entry) * position.qty
                    : (entry - symbolPrice) * position.qty,
            };
        });

        setPositions(updatedPositions);
    }, [symbolPrice, symbol]);


    const filteredPositions = useMemo(() => {
        const filtered = showClosed
            ? positions
            : positions.filter(pos => pos.status === 'OPEN');

        return [...filtered].sort((a, b) => b.id_position - a.id_position);

    }, [positions, showClosed, symbol]);


    return (
        <Card className="h-full">

            <PositionStatusListners 
                market={market}
                environment={environment}
                setPositions={setPositions}
            />

            <CardHeader className="pb-3">
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg">Posições Abertas</CardTitle>
                    <div className="flex items-center space-x-2">
                    <label htmlFor="showClosed" className="text-sm">
                        Mostrar fechadas
                    </label>
                    <input
                        id="showClosed"
                        type="checkbox"
                        checked={showClosed}
                        onChange={() => setShowClosed(!showClosed)}
                        className="accent-green-500"
                    />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[300px] overflow-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                        <TableHead className="text-center font-bold">ID</TableHead>
                        <TableHead className="w-[100px] text-center font-bold">Symbol</TableHead>
                        <TableHead className="text-center font-bold">Data Entrada</TableHead>
                        <TableHead className="text-center font-bold">Tipo</TableHead>
                        <TableHead className="text-center font-bold">Qtd.</TableHead>
                        <TableHead className="text-center font-bold">Preço Entrada</TableHead>
                        <TableHead className="text-center font-bold">Status</TableHead>
                        <TableHead className="text-center font-bold">P&L</TableHead>
                        <TableHead className="text-center font-bold">Ação</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredPositions.length > 0 ? (
                        filteredPositions.map((position) => (
                        
                            <TableRow key={position.id_position}>
                                <TableCell className="font-medium text-center">{position.id_position}</TableCell>
                                <TableCell className="font-medium text-center">{position.symbol}</TableCell>
                                <TableCell className="font-medium text-center">{formatDate(position.entry_time || position.created_at)}</TableCell>
                                <TableCell className="text-center">
                                    <span
                                        className={position.side.toLowerCase() === "buy" ? "text-green-400 font-bold" : "text-red-400 font-bold"}
                                    >
                                        {position?.side.toLowerCase() === "buy" ? "Compra" : "Venda"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">{position.qty}</TableCell>
                                <TableCell className="text-center">{position.entry_price ? position.entry_price.toLocaleString('pt-BR'): 0}</TableCell>
                                <TableCell className="text-center">{position.status}</TableCell>
                                <TableCell className="text-center">
                                    <span className={position.pnl  && position.pnl > 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                                        
                                        {position.pnl?.toLocaleString('pt-BR') || 0} 
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        className="cursor-pointer"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => closePosition(position.id_position)}
                                        disabled={position.status !== 'OPEN'}
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
