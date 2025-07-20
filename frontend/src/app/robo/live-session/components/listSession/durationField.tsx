import { formatarDuracaoDinamica } from "@/lib/utils";

interface ComponentProps {
    start_time: null | string;
    end_time: null | string;
}

export default function DurationField({start_time, end_time}: ComponentProps) {

    const entryDate = new Date(start_time || new Date()).getTime();
    const exitDate = new Date(end_time || new Date()).getTime();

    const duracaoSesungos = (exitDate - entryDate) / 1000

    return (
        <span>
            {formatarDuracaoDinamica(duracaoSesungos)}
        </span>
    )
}