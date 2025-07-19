'use client'

import { UTCTimestamp, createChart, IChartApi, BaselineSeries, LineData, ISeriesApi } from "lightweight-charts";
import { useEffect, useRef } from "react";


import { useSidebar } from "@/context/sidebarContext";


interface ReturnDataPointType {
    time: UTCTimestamp;
    value: number
}


interface ComponentProps {
    data: ReturnDataPointType[]
}



export default function ReturnLineChart({ data }: ComponentProps) {

    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<any | null>(null);
    
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

    const formattedData = data.map(point => ({
        time: point.time,
        value: point.value,
    }));

    useEffect(() => {
        if (!containerRef.current || !data.length) return;
        
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

        const series = chart.addSeries(BaselineSeries, {
            baseValue: { type: 'price', price: 0 }, // Linha de base em 0
            // Cores para a área positiva (lucro)
            topLineColor: 'rgba(38, 166, 154, 1)',   // Verde
            topFillColor1: 'rgba(38, 166, 154, 0.28)',
            topFillColor2: 'rgba(38, 166, 154, 0.05)',
            // Cores para a área negativa (prejuízo)
            bottomLineColor: 'rgba(239, 83, 80, 1)', // Vermelho
            bottomFillColor1: 'rgba(239, 83, 80, 0.05)',
            bottomFillColor2: 'rgba(239, 83, 80, 0.28)',
            lineWidth: 2,
        });

        series.setData(formattedData);
        
        chart.timeScale().fitContent();

        seriesRef.current = series;
        chartRef.current = chart;

        // -> MUDANÇA: Adaptando o Tooltip para os dados de retorno
        chart.subscribeCrosshairMove(param => {
            if (!param.point || !param.time || param.point.x < 0 || param.point.y < 0) {
                toolTip.style.display = 'none';
                return;
            }
        
            const timestamp = (param.time as number) * 1000;
            const date = new Date(timestamp);
            const horaBR = date.toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit',
            });
        
            // O dado da série agora é mais simples
            const returnData = param.seriesData.get(series) as LineData;
            
            if (!returnData) {
                toolTip.style.display = 'none';
                return;
            }

            const returnValue = returnData.value;
        
            toolTip.innerHTML = `
                <div style="font-size: 12px; color: white;">
                    <strong>Retorno: ${returnValue.toFixed(2)}%</strong><br/>
                    <small>${horaBR}</small>
                </div>
            `;
        
            toolTip.style.display = 'block';
            toolTip.style.left = param.point.x + 20 + 'px';
            toolTip.style.top = param.point.y + 20 + 'px';
        });

        return () => chart.remove();


    }, []);


    // -> MUDANÇA: Hook para atualizar os dados quando a prop 'data' mudar
    useEffect(() => {
        if (!seriesRef.current || !Array.isArray(data)) return;
    
        const formatted = data.map(point => ({
            time: point.time,
            value: point.value,
        }));
    
        seriesRef.current.setData(formatted);
    }, [data]);

    // Este hook de resize pode permanecer exatamente o mesmo
    useEffect(() => {
        const container = containerRef.current;
        const timeout = setTimeout(() => {
            if (container && chartRef.current) {
                chartRef.current.resize(container.clientWidth, container.clientHeight);
            }
        }, 310);
        return () => clearTimeout(timeout);
    }, [isCollapsed]);

    return (
        <div className="w-full h-full relative">
            <div ref={containerRef} className="w-full h-full" ></div>
        </div>
    )
}



