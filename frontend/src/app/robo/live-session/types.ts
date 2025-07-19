


export interface MetricType {
    total_trades: number;
    win_trades: number;
    lose_trades: number;
    win_rate: number;
    total_pnl_gross: number;
    return_pct: number;
}



export interface LiveSessionType {
    id_live_session: number;
    id_user: number;
    setting: object;
    symbol: string;
    interval: string;
    strategy_name: string;
    leverage: number;
    params: object;
    status: string;
    start_time: string;
    end_time: string;
    metrics: MetricType | null;
}
