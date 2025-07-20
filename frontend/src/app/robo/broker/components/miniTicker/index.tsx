
import MiniTickerListner from "./miniTickerListner"
import { MiniTickerType } from "../../types";


interface MiniTickerListnetProps {
    symbol: string;
    market: string;
    environment: string;
    miniTicker: MiniTickerType
    setMiniTicker: React.Dispatch<React.SetStateAction<MiniTickerType>>;
}


export default function MiniTickerComponent({ symbol, market, environment, miniTicker, setMiniTicker }: MiniTickerListnetProps) {

    return (
        <div className="h-full flex items-center justify-center p-4">
            <MiniTickerListner 
                symbol={symbol}
                market={market}
                environment={environment}
                setMiniTicker={setMiniTicker}
            />

            <h1 className={`text-xl md:text-3xl font-semibold ${miniTicker.pct_change_24h > 0 ? 'text-green-500' : 'text-red-500'}`} >

                U$ {miniTicker.close.toLocaleString('pt-BR')} | {miniTicker.pct_change_24h.toPrecision(2)}%
            </h1>

        </div>
    )
}
