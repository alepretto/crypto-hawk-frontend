import { UTCTimestamp , createChart, IChartApi, CandlestickSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";

import { CandleChartProps } from "../../types";
import { useSidebar } from "@/context/sidebarContext";



export default function CandleChart({ candles }: CandleChartProps) {

    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

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
                borderColor: '485c7b'
            },
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



