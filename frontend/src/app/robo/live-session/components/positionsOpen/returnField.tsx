import { formatNumber } from "@/lib/utils";

interface ComponentProps {
    pnl: number | null;
    qty: number | null;
    entry_price: number | null;
}


export default function ReturnField({ pnl, qty, entry_price }: ComponentProps) {

    if (!pnl || !entry_price) {
        const pct_return = 0;
    }

    const pct_return = 1

    const color = !pct_return
        ? 'text-gray-500'
        : pct_return >= 0
        ? "text-green-500"
        : "text-red-500";


    return (
        <span className={`font-mono ${color}`}>
            {pct_return >= 0 ? "+" : ""}
            {formatNumber(pct_return * 100)}
        </span>
    )
}