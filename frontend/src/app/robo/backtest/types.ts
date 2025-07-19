



export interface BacktestMetricType {
    id_backtest: number;
    id_user: number;
    total_trades: number;
    win_trades: number;
    lose_trades: number;
    win_rate: number;
    total_pnl_gross: number;
    max_drawdown: number;
    sharpe_ratio: number;
    return_pct: number;
    avg_trade_duartion: number;
    avg_pnl_gross: number;
    std_pnl_gross: number;
    created_at: string;
}


export interface TradesSummary {
    id_backtest_trade_summary: number;
    id_backtest: number;
    id_trade: number;
    total_trades: number;
    side: string;
    flag_win_trade: true,
    pnl_gross: number;
    return_pct: number;
    amount: number;
    seconds_duration: number;
    entry_price: number;
    exit_price: number;
    entry_time: string;
    exit_time: string;
    return_accum: number;
    created_at: string;
}


export interface BacktestType {

    id_backtest: number;
    symbol: string;
    interval: string;
    market: string;
    strategy_name: string;
    leverage: number;
    params: object;
    start_time: string;
    end_time: string;
    metrics: null | BacktestMetricType;
}


export interface BacktestFullType {

    id_backtest: number;
    symbol: string;
    interval: string;
    market: string;
    strategy_name: string;
    leverage: number;
    params: object;
    start_time: string;
    end_time: string;
    metrics: null | BacktestMetricType;
    trades_summary: null | TradesSummary[];
}
