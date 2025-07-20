'use client'

import { UTCTimestamp , createChart, IChartApi, CandlestickSeries, CandlestickData } from "lightweight-charts";
import { useEffect, useRef } from "react";

import { CandleChartProps } from "../../types";
import { useSidebar } from "@/context/sidebarContext";



export default function CandleChart({ candles }: CandleChartProps) {

    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
    
    const toolTip = document.createElement('div');
    toolTip.style.position = 'absolute';
    toolTip.style.zIndex = '1000';
    toolTip.style.background = 'rgba(0, 0, 0, 0.5)';
    toolTip.style.padding = '4px 8px';
    toolTip.style.borderRadius = '4px';
    toolTip.style.pointerEvents = 'none';
    toolTip.style.color = 'white';
    toolTip.style.display = 'none';
    toolTip.style.transition = 'all 0.2s ease';


    const { isCollapsed } = useSidebar();

    const formattedCandles = candles.map(c => ({
        time: c.open_time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume
    }));

    useEffect(() => {
        if (!containerRef.current || !candles.length) return;
        
        containerRef.current.appendChild(toolTip);

        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            layout: {
                background: { color: '#1e1e1e'},
                textColor: '#d1d5db'
            },
            grid: {
                vertLines: { color: '#2b2b43'},
                horzLines: { color: '#363c4e' }
            },
            timeScale: {
                borderColor: '485c7b',
                timeVisible: true, 
                tickMarkFormatter: (time: number) => {
                    const date = new Date(time * 1000); // time vem como timestamp em segundos
                    return date.toLocaleTimeString('pt-BR', {
                      timeZone: 'America/Sao_Paulo',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                }
            },
            crosshair: {
                vertLine: {
                    labelVisible: false, // ✅ desativa o horário no eixo X (tooltip nativa)
                },
                horzLine: {
                    labelVisible: true, // se quiser manter a do preço
                },
                mode: 1,
            },
        });

        chart.subscribeCrosshairMove(param => {
            if (
                !param.point ||
                !param.time ||
                param.point.x < 0 ||
                param.point.y < 0
            ) {
                toolTip.style.display = 'none';
                return;
            }
        
            const timestamp = (param.time as number) * 1000;
            const date = new Date(timestamp);
        
            const horaBR = date.toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
            });
        
            const data = param.seriesData.get(series) as CandlestickData;
            const price = data?.close;

            const formatedPrice = price.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
            });
        
            toolTip.innerHTML = `
                <div style="font-size: 12px; color: white;">
                    <strong>${formatedPrice} USDT</strong><br/>
                    ${horaBR}
                </div>
            `;
        
            toolTip.style.display = 'block';
            toolTip.style.left = param.point.x + 'px';
            toolTip.style.top = param.point.y + 'px';
        });

        chartRef.current = chart;

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a', 
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        series.applyOptions({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        seriesRef.current = series;
        series.setData(formattedCandles);
        
      
        return () => chart.remove();


    }, []);


    useEffect(() => {
        
        if (!seriesRef.current || !Array.isArray(candles)) return;
    
        const formatted = candles.map(c => ({
          time: c.open_time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));
    
        seriesRef.current.setData(formatted);
    }, [candles]);

    useEffect(() => {
        const container = containerRef.current;
      
        // Dá tempo da sidebar terminar de abrir antes de redimensionar
        const timeout = setTimeout(() => {
          if (container && chartRef.current) {
            chartRef.current.resize(container.clientWidth, container.clientHeight);
          }
        }, 310); // um pouco mais que a transição
      
        return () => clearTimeout(timeout);
    }, [isCollapsed]);



    return (
        <div className="w-full h-full relative">
            <div ref={containerRef} className="w-full h-full" ></div>
        </div>
    )
}



