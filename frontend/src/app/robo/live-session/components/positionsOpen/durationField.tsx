import { formatarDuracaoDinamica } from "@/lib/utils";

interface ComponentProps {
    entry_time: null | string;
    exit_time: null | string;
}

export default function DurationField({entry_time, exit_time}: ComponentProps) {

    const entryDate = new Date(entry_time || new Date()).getTime();
    const exitDate = new Date(exit_time || new Date()).getTime();

    const duracaoSesungos = (exitDate - entryDate) / 1000

    return (
        <span>
            {formatarDuracaoDinamica(duracaoSesungos)}
        </span>
    )
}