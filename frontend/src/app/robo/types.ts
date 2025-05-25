

export interface MiniTickerType {

    change_24h: number;
    close: number;
    open:number;
    high:number;
    low:number;
    pct_change_24h:number;
    negociacoes:number;
    timestamp: string;
    symbol: string;
}



export interface SymbolAnalysisType {

    symbol: string;
    interval: string;
    market: string;
    environment: string;
    loading: boolean;
    candles: CandleChartType[];

    setCandles: React.Dispatch<React.SetStateAction<CandleChartType[]>>;
    setLoading: (value: boolean) => void;
}


export interface CreateOrderFormsType {
    symbol: string;
    interval: string;
    market: string;
    environment: string;
}


export interface CandleChartType {
    open_time: number;
    close_time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}


export interface CandleChartProps {
    candles: CandleChartType[],
    // symbol: string;
}



export interface CandleInfo {
    symbol: string;
    interval: string;
    open_time: number;
    close_time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    taker_buy_quote_volume: number;
    total_quote_volume: number;
}


export interface InfoMessage {
    info: {
        is_final: boolean;
        candle: CandleInfo
    };
}


export interface AssestBalanceType {
    asset: string;
    balance: number;
}
