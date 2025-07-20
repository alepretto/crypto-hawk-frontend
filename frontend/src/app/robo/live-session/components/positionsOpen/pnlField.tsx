import { formatNumber, formatterCurrency } from "@/lib/utils";


interface ComponentProps {

    pnl: number | null;
}

export default function PnlField({ pnl}: ComponentProps) {


    

    const color = !pnl
        ? 'text-gray-500'
        : pnl >= 0
        ? "text-green-500"
        : "text-red-500";

    pnl = !pnl ? 0 : pnl


    return (
        <span className={`font-mono ${color}`}>
            {pnl >= 0 ? "+" : ""}
            {formatterCurrency.format(pnl)}
        </span>
    )
}
