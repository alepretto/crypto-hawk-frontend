
import { formatNumber, formatterCurrency } from "@/lib/utils";
import { LiveSessionType } from "../../types";


type ComponentProps = {
    session: LiveSessionType;
    metric: string
};



export function ReturnSessionDisplay({ session, metric }: ComponentProps)  {

    const formatCurrency = (value: number, decimals = 2) => {
        return value.toFixed(decimals)
    }

    let pnl;
    if (metric === 'pnl') {
        pnl = session?.metrics?.total_pnl_gross;
    } else {
        pnl = session?.metrics?.return_pct;
    }

    const isPositive = typeof pnl === 'number' && pnl > 0;
    const isNeutro = !pnl || pnl === 0;
    
    let pnlColorClass;

    if (isNeutro) {
        pnlColorClass = 'text-gray-500'
    } else if (isPositive) {
        pnlColorClass = 'text-green-500'
    } else {
        pnlColorClass = 'text-red-500'
    }

    // const pnlColorClass = isNeutro ? 'text-gray-100' : isPositive ?'text-green-500' : 'text-red-500';

    let metricDisplay;
    if (metric == 'pnl' ) {
        metricDisplay = `${formatterCurrency.format(pnl ?? 0)}`;
    } else {
        metricDisplay = `${formatNumber(pnl ? pnl * 100 : 0)}%`
    }


    return (
        <span className={`font-mono ${pnlColorClass}`}>
            {/* Agora use as variáveis limpas no seu JSX */}
            {isPositive ? '+' : ''}{metricDisplay}
        </span>
    );
};