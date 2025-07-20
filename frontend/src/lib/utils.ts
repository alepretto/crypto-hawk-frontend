import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR", {
        
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",

        hour: "2-digit",
        minute: "2-digit",
    });
}


export const formatNumber = (value: number, decimals = 2) => {
    return value.toFixed(decimals)
}

export const formatterCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});



export function capitalizarFrase(frase: string) {
    // Retorna uma string vazia se a entrada for inválida
    if (!frase || typeof frase !== 'string') {
        return "";
    }

    return frase
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}


export function formatarDuracaoDinamica(totalSegundos: number) {
    if (totalSegundos === 0) {
        return "0 segundos";
    }

    // 1. Define as constantes de conversão
    const SEGUNDOS_POR_MINUTO = 60;
    const SEGUNDOS_POR_HORA = 3600; // 60 * 60
    const SEGUNDOS_POR_DIA = 86400; // 3600 * 24

    // 2. Calcula cada unidade de tempo
    const dias = Math.floor(totalSegundos / SEGUNDOS_POR_DIA);
    let segundosRestantes = totalSegundos % SEGUNDOS_POR_DIA;

    const horas = Math.floor(segundosRestantes / SEGUNDOS_POR_HORA);
    segundosRestantes %= SEGUNDOS_POR_HORA;

    const minutos = Math.floor(segundosRestantes / SEGUNDOS_POR_MINUTO);
    segundosRestantes %= SEGUNDOS_POR_MINUTO;
    
    const segundos = Math.round(segundosRestantes); // Arredonda os segundos finais

    // 3. Monta um array com as partes que não são zero
    const parts = [];
    if (dias > 0) {
        parts.push(`${dias} ${dias === 1 ? 'dia' : 'dias'}`);
    }
    if (horas > 0) {
        parts.push(`${horas} ${horas === 1 ? 'hora' : 'horas'}`);
    }
    if (minutos > 0) {
        parts.push(`${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`);
    }
    // if (segundos > 0) {
    //     parts.push(`${segundos} ${segundos === 1 ? 'segundo' : 'segundos'}`);
    // }

    // 4. Formata a string de saída de forma inteligente
    if (parts.length === 1) {
        return parts[0];
    }

    // Pega o último elemento para usar com "e"
    const ultimoElemento = parts.pop();
    
    // Junta os elementos restantes com vírgula e adiciona o último com "e"
    return parts.join(', ') + ' e ' + ultimoElemento;
}

