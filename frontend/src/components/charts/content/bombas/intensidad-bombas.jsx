import { useRef, useState, useEffect } from 'react';
import { LineChart } from '@/components/charts/types/line';
import useSWR from "swr"
import { fetcher } from "@/lib/itecam/fetcher";
import { useTimeFilter } from '@/context/filter-time-context';
import { parseDataInflux } from "@/lib/itecam/parse-data-influx";
import { API_IP } from "@/lib/utils";

export function IntensidadBombasChart() {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        data: [],
        timeLabels: []
    });

    const { getFilterQueryString } = useTimeFilter();
    const timeFilter = getFilterQueryString()

    const configSWR = {
        refreshInterval: 1000,
        dedupingInterval: 500,
        revalidateOnFocus: false
    }

    const { data: historicalData, error, isLoading } = useSWR(
        `${API_IP}/api/influx/data/amperage_pumps?${timeFilter}`,
        fetcher,
        configSWR
    )

    useEffect(() => {
        if (!historicalData?.results) return;


        const data = parseDataInflux(historicalData.results);

        const timeArray = historicalData.results.map(item => {
            const date = new Date(item.time);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        });

        setChartData({
            data,
            timeLabels: timeArray
        });

    }, [historicalData]);

    useEffect(() => {
        if (chartRef.current && chartRef.current.getEchartsInstance) {
            const chartInstance = chartRef.current.getEchartsInstance();
            chartInstance?.setOption({
                animation: false,
                xAxis: {
                    data: chartData.timeLabels
                },
                series: [{ data: chartData.data }]
            });
        }
    }, [chartData]);

    const etiquetas = chartData.timeLabels;

    const params = {
        title: {
            text: 'Intensidad (A)',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: etiquetas,
            boundaryGap: false,
            axisLabel: {
                interval: "25",
                rotate: 45
            },
        },
        yAxis: {
            type: 'value',
            name: 'A'
        },
        grid: {
            left: "5%",
            right: "4%",
            bottom: "5%",
            top: "15%",
            containLabel: true
        },
    };

    const series = [
        {
            name: 'Intensidad',
            data: chartData.data,
            smooth: true,
            showSymbol: false,
            color: '#007bff'
        }
    ];

    if (isLoading) return <div className="text-center">Cargando datos...</div>;
    if (error) {
        console.error("Error cargando datos:", error);
        return <div className="text-center text-red-500">Error cargando datos</div>;
    }

    return (
        <LineChart
            ref={chartRef}
            params={params}
            series={series}
        />
    );
}
