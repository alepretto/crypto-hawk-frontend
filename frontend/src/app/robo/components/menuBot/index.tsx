"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface ChartControlsProps {
    onSymbolChange: (value: string) => void
    onIntervalChange: (value: string) => void
    onMarketChange: (value: string) => void
    onEnvironmentChange: (value: string) => void

    symbol: string;
    market: string;
    environment: string;
    interval: string;

}

export function ChartControls({ onSymbolChange, onIntervalChange, onMarketChange, onEnvironmentChange, symbol, market, environment, interval }: ChartControlsProps) {

    return (
        <Card className="border">
            <CardContent className="pt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="space-y-2">
                    <Label htmlFor="symbol">Par de Trading</Label>
                    <Select defaultValue="BTCUSDT" value={symbol} onValueChange={onSymbolChange}>
                        <SelectTrigger id="symbol" className="w-full">
                        <SelectValue placeholder="Selecione um par" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                        <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                        <SelectItem value="BNBUSDT">BNB/USDT</SelectItem>
                        <SelectItem value="ADAUSDT">ADA/USDT</SelectItem>
                        <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                        <SelectItem value="DOGEUSDT">DOGE/USDT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="interval">Intervalo</Label>
                    <Select defaultValue="1h" value={interval} onValueChange={onIntervalChange}>
                        <SelectTrigger id="interval" className="w-full">
                            <SelectValue placeholder="Selecione um intervalo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1m">1 minuto</SelectItem>
                            <SelectItem value="5m">5 minutos</SelectItem>
                            <SelectItem value="15m">15 minutos</SelectItem>
                            <SelectItem value="30m">30 minutos</SelectItem>
                            <SelectItem value="1h">1 hora</SelectItem>
                            <SelectItem value="4h">4 horas</SelectItem>
                            <SelectItem value="1d">1 dia</SelectItem>
                            <SelectItem value="1w">1 semana</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="market">Mercado</Label>
                    <Select defaultValue="futures"  value={market} onValueChange={onMarketChange}>
                        <SelectTrigger id="market" className="w-full">
                        <SelectValue placeholder="Selecione um mercado" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="futures">Futures</SelectItem>
                        <SelectItem value="spot">Spot</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="environment">Ambiente</Label>
                    <Select defaultValue="testnet" value={environment} onValueChange={onEnvironmentChange}>
                        
                        <SelectTrigger id="environment" className="w-full">
                        <SelectValue placeholder="Selecione um ambiente" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="mainnet">Mainnet</SelectItem>
                        <SelectItem value="testnet">Testnet</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
