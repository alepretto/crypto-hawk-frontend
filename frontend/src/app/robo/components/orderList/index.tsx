"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

import OrderStatusListner from "./orderStatusListner"

interface OpenOrdersInput {
    symbol: string;
    environment: string;
    market: string
}


export interface OrderType {
    id_user: number,
    environment: string,
    id_order: number,
    symbol: string,
    status: string,
    type: string,
    side: string,
    price: number,
    avg_price: number,
    orig_qty: number,
    executed_qty: number,
    cum_quote: number,
    stop_price: number,
    time_in_force: string,
    reduce_only: boolean,
    close_position: boolean,
    position_side: string,
    working_type: string,
    price_protect: boolean,
    update_time: string
}



export function OpenOrdersLog( { symbol, environment, market }: OpenOrdersInput) {

    const [orders, setOrders] = useState<OrderType[]>([])


    const getOrders = async () => {
        if (!symbol || !environment || !market) return null;

        try {
            const { data } = await axios.get(`/api/binance/orders`, {
                params: {
                    environment,
                    symbol,
                    market
                }
            });
            setOrders(data.orders)
        } catch(error) {
            console.error(error)
        }
    }


    useEffect(() => {
        getOrders();

    }, [symbol, environment, market])

    const cancelOrder = async (orderId: number) => {

        try {
            await axios.delete(`/api/binance/orders`, {
                params: {
                    environment,
                    symbol,
                    market,
                    orderId
                }
            });
        } catch(error) {
            console.error(error)
        } finally {
            getOrders();
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            // year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        
        <Card className="h-full">

            <OrderStatusListner 
                market={market}
                environment={environment}
                setOrders={setOrders}
            />

            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ordens Abertas</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <div className="max-h-[300px] overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-card">
                            <TableRow className="font-bold">
                                <TableHead className="w-[100px] text-center font-bold">Symbol</TableHead>
                                <TableHead className="text-center font-bold">Tipo</TableHead>
                                <TableHead className="text-center font-bold">Side</TableHead>
                                <TableHead className="text-center font-bold">Preço</TableHead>
                                <TableHead className="text-center font-bold">Qtd.</TableHead>
                                <TableHead className="text-center font-bold">Status</TableHead>
                                <TableHead className="text-center font-bold">Hora</TableHead>
                                <TableHead className="text-center font-bold">Ação</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                <TableRow key={order.id_order}>
                                    <TableCell className="font-medium text-center">{order.symbol}</TableCell>
                                    <TableCell className="capitalize text-center">{order.type}</TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            className={order.side.toLowerCase() === "buy" ? "text-green-400 font-bold" : "text-red-400 font-bold"}
                                        >
                                            {order?.side.toLowerCase() === "buy" ? "Compra" : "Venda"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {
                                            order.price? order.price.toLocaleString('pt-BR') : order.stop_price? order.stop_price.toLocaleString('pt-BR') : order.avg_price.toLocaleString('pt-BR')
                                        }
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {order.executed_qty > 0 ? `${order.executed_qty}/${order.orig_qty}` : order.orig_qty}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={order.status === "NEW" ? "outline" : "secondary"} className={order.status === 'FILLED'? 'bg-green-500' : 'bg-orange-400'}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{formatDate(order.update_time)}</TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="icon" onClick={() => cancelOrder(order.id_order)} title="Cancelar ordem" className="cursor-pointer">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                                    Nenhuma ordem aberta
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
