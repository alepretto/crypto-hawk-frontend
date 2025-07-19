import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils"

import { useState } from "react";
import { LiveSessionType } from "../../types";
import { ReturnSessionDisplay } from "./returnStrategy"


interface ComponentProps {

    liveSessions: LiveSessionType[],
    showOnlyRunning: boolean;
    setShowOnlyRunning: (value: boolean) => void;

}



export default function ListSessionComponent({ liveSessions, showOnlyRunning, setShowOnlyRunning }: ComponentProps) {


    return (

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg">Estratégias em Execução</CardTitle>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="show-running"
                        checked={showOnlyRunning}
                        onCheckedChange={(checked) => setShowOnlyRunning(Boolean(checked))}
                        className="cursor-pointer"
                    />
                    <label 
                        htmlFor="show-running"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Apenas Em Execução
                    </label>
                </div>
            </CardHeader>
            <CardContent className="p-0 ">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[15%] text-center font-bold text-[1.2rem]">Nome</TableHead>
                            <TableHead className="w-[15%] text-center font-bold text-[1.2rem]">Símbolo</TableHead>
                            <TableHead className="w-[15%] text-center font-bold text-[1.2rem]">Status</TableHead>
                            <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">P&L</TableHead>
                            <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">% P&L</TableHead>
                            <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Trades</TableHead>
                            <TableHead className="w-[10%] text-center font-bold text-[1.2rem]">Win Rate</TableHead>
                            <TableHead className="w-[20%] text-center font-bold text-[1.2rem]">Inicio</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody >

                        {liveSessions.map((session) => (
                            <TableRow key={session.id_live_session}>
                                <TableCell className="text-center font-medium">{session.strategy_name}</TableCell>
                                <TableCell className="text-center font-mono">{session.symbol}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={session.status === "running" ? "default" : "secondary"}>
                                        {session.status === "running" ? "Executando" : "Finalizada"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <ReturnSessionDisplay 
                                        session={session}
                                        metric="pnl"
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <ReturnSessionDisplay 
                                        session={session}
                                        metric="return"
                                    />
                                </TableCell>
                                <TableCell className="text-center font-mono">{session?.metrics? session?.metrics.total_trades : 0}</TableCell>
                                <TableCell className="text-center font-mono">{session?.metrics? session?.metrics.win_rate * 100 : 0}%</TableCell>
                                <TableCell className="text-center text-sm text-muted-foreground">{formatDate(session.start_time)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </CardContent>
        </Card>

    )

}

