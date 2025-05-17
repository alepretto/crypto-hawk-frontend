"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch, Controller } from "react-hook-form"

import { z } from "zod"
import { ArrowDownUp, HashIcon, DollarSign,  } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input, NumericInput } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Toaster } from "@/components/ui/sonner"


import OrderBookPrice from "./orderBookPrices"
import { AssestBalanceType } from '../../types'
import AssetBalance from "./assetBalance"

const formSchema = z.object({
  asset: z.string().optional(),
  orderType: z.string().min(1, {
    message: "Por favor selecione um tipo de ordem.",
  }),
  quantity: z.string().min(1, {
    message: "Por favor insira uma quantidade.",
  }),
  price: z.string().optional(),
  stopLoss: z.string().optional(),
  takeProfit: z.string().optional(),
  leverage: z.string().optional(),
})

interface FormFieldsType {
    symbol: string;
    market: string;
    environment: string;
    baseAsset: AssestBalanceType | null;
    quoteAsset: AssestBalanceType | null;
    setBaseAsset: (valor: AssestBalanceType) => void;
    setQuoteAsset: (valor: AssestBalanceType) => void;
}



export function TradeOrderForm( { symbol, market, environment, setBaseAsset, setQuoteAsset, baseAsset, quoteAsset}: FormFieldsType ) {

    const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
    const [advancedOptions, setAdvancedOptions] = useState(false);
    const [bestPrice, setBestPrice] = useState(true);

    const [bestBidPrice, setBestBidPrice] = useState<number | null>(null);
    const [bestAskPrice, setBestAskPrice] = useState<number | null>(null);

    const [amount, setAmount] = useState(0);


    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
    });


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            asset: "",
            orderType: "market",
            quantity: "",
            price: "0",
            stopLoss: "",
            takeProfit: "",
            leverage: "1",
        },
    })

    useEffect(() => {

        if (!bestPrice) return;

        const priceToSet = orderSide === "buy" ? bestBidPrice : bestAskPrice;

        if (priceToSet) {
            form.setValue("price", priceToSet.toString());
        }

    }, [bestAskPrice, bestBidPrice, bestPrice]);

    
    const watchedPrice = useWatch({ control: form.control, name: "price" });
    const watchedQuantity = useWatch({ control: form.control, name: "quantity" });

    useEffect(() => {
        const price = parseFloat(watchedPrice || "0");
        const quantity = parseFloat(watchedQuantity || "0");

        if (!isNaN(price) && !isNaN(quantity)) {
            setAmount(price * quantity);
        } else {
            setAmount(0);
        }
    }, [watchedPrice, watchedQuantity]);


    useEffect(() => {
        if (symbol) {
            form.setValue("asset", symbol);
        }
    }, [symbol, form]);


    function onSubmit(values: z.infer<typeof formSchema>) {

        const ordersParms = {
            asset: values.asset,
            quantity: parseFloat(values.quantity), 
            price: values.price? parseFloat(values.price) : null, 
            stopLoss: values.stopLoss? parseFloat(values.stopLoss) : null, 
            takeProfit: values.takeProfit? parseFloat(values.takeProfit) : null,
            orderType: values.orderType,
            orderSide
        }


        console.log(ordersParms)
        // Toaster({
        //     containerAriaLabel: `ad`
        // //   title: "Ordem enviada",
        // //   description: `${orderSide === "buy" ? "Compra" : "Venda"} de ${values.quantity} ${values.asset}`,
        // })
    }

    return (
        <Card className="w-full border">
            <CardHeader>
                <CardTitle className="text-xl">Criar Ordem de Trade</CardTitle>
                <CardDescription>Configure os detalhes da sua ordem de trade</CardDescription>
            </CardHeader>

            <CardContent>

                <Tabs value={market} className="w-full mb-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="spot">Spot</TabsTrigger>
                        <TabsTrigger value="futures">Futuros</TabsTrigger>
                        {/* <TabsTrigger value="options">Opções</TabsTrigger> */}
                    </TabsList>
                </Tabs>
                

                <div className="flex justify-between mb-6">
                    <Button
                        variant={orderSide === "buy" ? "default" : "outline"}
                        className={`w-[49%] ${orderSide === "buy" ? "bg-green-500 hover:bg-green-600 text-white font-bold" : ""} cursor-pointer`}
                        onClick={() => setOrderSide("buy")}
                    >
                        Comprar
                    </Button>
                    <Button
                        variant={orderSide === "sell" ? "default" : "outline"}
                        className={`w-[49%] ${orderSide === "sell" ? "bg-red-500 hover:bg-red-600 text-white font-bold" : ""} cursor-pointer`}
                        onClick={() => setOrderSide("sell")}
                    >
                        Vender
                    </Button>
                </div>

                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <FormField
                                control={form.control}
                                name="asset"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ativo</FormLabel>
                                        <Input {...field} type="text" disabled />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="orderType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Tipo de Ordem</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o tipo de ordem" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="market">Mercado</SelectItem>
                                            <SelectItem value="limit">Limite</SelectItem>
                                            <SelectItem value="stop">Stop</SelectItem>
                                            <SelectItem value="stopLimit">Stop Limite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Controller
                            name="quantity"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                    <NumericInput
                                        name={field.name}
                                        value={Number(field.value) || ""}
                                        onBlur={field.onBlur}
                                        getInputRef={field.ref}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        allowNegative={false}
                                        decimalScale={4}
                                        fixedDecimalScale
                                        placeholder="0,0000"
                                        onValueChange={(values) => {
                                            field.onChange(values.value); // valor limpo (ex: "1234.56")
                                        }}
                                    />
                                    <div className="absolute right-3 top-0 h-full flex items-center">
                                        <HashIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            {/* PRICE FIELD */}
                            <Controller
                                name="price"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                    <FormLabel>Preço</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                        <NumericInput
                                            name={field.name}
                                            value={Number(field.value) || ""}
                                            onBlur={field.onBlur}
                                            getInputRef={field.ref}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            allowNegative={false}
                                            decimalScale={2}
                                            fixedDecimalScale
                                            disabled={bestPrice}
                                            placeholder="0,00"
                                            onValueChange={(values) => {
                                                field.onChange(values.value); // valor limpo (ex: "1234.56")
                                            }}
                                        />
                                        <div className="absolute right-3 top-0 h-full flex items-center">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* AMOUNT + SWITCH */}
                            <div className="w-full relative">
                                <FormLabel className="invisible">Total</FormLabel> {/* só pra manter o alinhamento */}
                                <div className="relative">
                                    <Input value={amount !== null ? formatter.format(amount) : ""} disabled />
                                    <div className="absolute right-3 top-0 h-full flex items-center">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                {/* SWITCH no canto direito */}
                                <div className="absolute -top-3 right-0 flex items-center space-x-2">
                                    <Switch
                                        id="best-price-options"
                                        className="cursor-pointer"
                                        checked={form.watch(`orderType`) === `market` ? true: bestPrice}
                                        disabled={form.watch(`orderType`) === `market`}
                                        onCheckedChange={setBestPrice}
                                    />
                                    <label
                                        htmlFor="best-price-options"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Best Price
                                    </label>

                                    <OrderBookPrice
                                        bestPriceOn={bestPrice}
                                        symbol={symbol}
                                        market={market}
                                        environment={environment}
                                        setBestAskPrice={setBestAskPrice}
                                        setBestBidPrice={setBestBidPrice}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="advanced-options" className="cursor-pointer" checked={advancedOptions} onCheckedChange={setAdvancedOptions} />
                            <label
                                htmlFor="advanced-options"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Opções avançadas
                            </label>
                        </div>

                        {advancedOptions && (
                        <>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <Controller
                                    name="stopLoss"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                        <FormLabel>Stop Loss</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                            <NumericInput
                                                name={field.name}
                                                value={Number(field.value) || ""}
                                                onBlur={field.onBlur}
                                                getInputRef={field.ref}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale
                                                placeholder="0,00"
                                                onValueChange={(values) => {
                                                    field.onChange(values.value); // valor limpo (ex: "1234.56")
                                                }}
                                            />
                                            <div className="absolute right-3 top-0 h-full flex items-center">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Controller
                                    name="takeProfit"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                        <FormLabel>Take Profit</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                            <NumericInput
                                                name={field.name}
                                                value={Number(field.value) || ""}
                                                onBlur={field.onBlur}
                                                getInputRef={field.ref}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale
                                                placeholder="0,00"
                                                onValueChange={(values) => {
                                                    field.onChange(values.value); // valor limpo (ex: "1234.56")
                                                }}
                                            />
                                            <div className="absolute right-3 top-0 h-full flex items-center">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />


                            </div>

                            

                            {/* <FormField
                            control={form.control}
                            name="leverage"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Alavancagem</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a alavancagem" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">1x</SelectItem>
                                        <SelectItem value="2">2x</SelectItem>
                                        <SelectItem value="5">5x</SelectItem>
                                        <SelectItem value="10">10x</SelectItem>
                                        <SelectItem value="20">20x</SelectItem>
                                        <SelectItem value="50">50x</SelectItem>
                                        <SelectItem value="100">100x</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            /> */}
                        </>
                        )}

                        <Button type="submit" className="w-full cursor-pointer">
                            {orderSide === "buy" ? "Comprar" : "Vender"} {form.watch("asset") || "Ativo"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                    <ArrowDownUp className="mr-1 h-3 w-3" />
                    <span>Taxa: 0.1%</span>
                </div>
                <AssetBalance 
                    symbol={symbol}
                    market={market}
                    environment={environment}
                    setBaseAsset={setBaseAsset}
                    setQuoteAsset={setQuoteAsset}
                />
                {(orderSide === 'buy') ? (
                    <div>Saldo: {quoteAsset?.balance ? quoteAsset.balance.toLocaleString('pt-BR') : 0} {quoteAsset?.asset}</div>
                ): (
                    <div>Saldo: {baseAsset?.balance ? baseAsset.balance.toLocaleString('pt-BR') : 0} {baseAsset?.asset}</div>
                )}
                
            </CardFooter>
        </Card>
    )
}
