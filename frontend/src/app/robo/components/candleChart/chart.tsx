import { UTCTimestamp , createChart, IChartApi, CandlestickSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";


import { CandleChartProps } from "../../types";



export default function CandleChart({ candles }: CandleChartProps) {

    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);


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
            height: 600,
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
        const container = containerRef.current;
        const chart = chartRef.current;
      
        if (!container || !chart) return;
      
        const resize = () => {
          chart.resize(container.clientWidth, container.clientHeight);
        };
      
        // ResizeObserver: mudanças no container
        const observer = new ResizeObserver(resize);
        observer.observe(container);
      
        // window resize: DevTools, redimensionamento de janela
        window.addEventListener('resize', resize);
      
        return () => {
          observer.disconnect();
          window.removeEventListener('resize', resize);
        };
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


    return (
        <div className="w-full h-full relative">
            <div ref={containerRef} className="w-full h-full" ></div>
        </div>
    )
}



