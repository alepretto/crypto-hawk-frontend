import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { TrendingUp, TrendingDown, } from "lucide-react"

import { formatNumber, formatterCurrency } from "@/lib/utils"
import { PositionType } from "@/app/robo/types"

import PnlField from "./pnlField"
import ReturnField from "./returnField"
import DurationField from "./durationField"


interface ComponentProps {
    positions: PositionType[];
    loading: boolean;
}



export default function PositionsOpen({ positions, loading }: ComponentProps) {

    return (

        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Posições Abertas</CardTitle>
                </CardHeader>
                
                <CardContent className="p-0">
                    <Table className="table-fixed w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Símbolo</TableHead>
                                <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Lado</TableHead>
                                <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Tamanho</TableHead>
                                <TableHead className="w-[15%] text-center font-bold text-[1.2rem]">Preço Entrada</TableHead>
                                <TableHead className="w-[15%] text-center font-bold text-[1.2rem]">Preço Atual</TableHead>
                                <TableHead className="w-[12%] text-center font-bold text-[1.2rem]">P&L</TableHead>
                                <TableHead className="w-[12%] text-center font-bold text-[1.2rem]">%</TableHead>
                                <TableHead className="w-[15%] text-center font-bold text-[1.2rem]">Duração</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            { loading ? 
                            
                            (
                                <TableRow className="text-center bold">
                                    <TableCell>Carregando...</TableCell>
                                </TableRow>
                            ) : positions.length === 0 ?
                            (
                                <TableRow >
                                    <TableCell colSpan={8} className="py-10 text-center"> {/* Adiciona espaçamento vertical e centraliza o texto aqui */}
                                        <p className="font-bold text-gray-500 text-xl"> {/* Usa <p>, font-bold e uma cor sutil */}
                                            Nenhuma posição em aberto...
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) :
                            
                            positions.map((position) => (
                                <TableRow key={position.id_position} className="text-center text-[1rem]">
                                    <TableCell className="font-mono">{position.symbol}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 justify-center">
                                        {position.side === "BUY" ? (
                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3 text-red-500" />
                                        )}
                                        <span
                                            className={`font-medium ${position.side === "BUY" ? "text-green-500" : "text-red-500"}`}
                                        >
                                            {position.side === "BUY" ? "Long" : "Short"}
                                        </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{position.qty}</TableCell>
                                    <TableCell className="font-mono">{formatterCurrency.format(position.entry_price ?? 0)}</TableCell>
                                    <TableCell className="font-mono">{formatNumber(0, 2)}</TableCell>
                                    <TableCell>
                                        
                                        <PnlField pnl={position.pnl} />

                                    </TableCell>
                                    <TableCell>
                                        <ReturnField 
                                            entry_price={position.entry_price}
                                            pnl={position.pnl}
                                            qty={position.qty}
                                        />
                                        
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <DurationField 
                                            entry_time={position.entry_time}
                                            exit_time={position.close_time}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}