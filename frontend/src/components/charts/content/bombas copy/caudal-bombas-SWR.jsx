import { useRef, useState, useEffect } from 'react';
import { LineChart } from '@/components/charts/types/line';
import useSWR from "swr"
import { fetcher } from "@/lib/itecam/fetcher";
import { useTimeFilter } from '@/context/filter-time-context';
import { parseDataInflux } from "@/lib/itecam/parse-data-influx";

export function CaudalBombasChart() {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        anodeData: [],
        cathodeData: [],
        timeLabels: []
    });

    const { getFilterQueryString } = useTimeFilter();
    const timeFilter = getFilterQueryString()

    const configSWR = {
        refreshInterval: 1000,
        dedupingInterval: 500,
        revalidateOnFocus: false // Evitar revalidaciones innecesarias
    }

    const { data: historicalDataAnode, error: errorAnode, isLoading: isLoadingAnode } = useSWR(
        `http://192.168.15.151:8002/api/influx/data/flow_anode?${timeFilter}`,
        fetcher,
        configSWR
    )
    const { data: historicalDataCathode, error: errorCathode, isLoading: isLoadingCathode } = useSWR(
        `http://192.168.15.151:8002/api/influx/data/flow_cathode?${timeFilter}`,
        fetcher,
        configSWR
    )
    console.log("TIMEEEEE", timeFilter)

    useEffect(() => {
        // Solo proceder si tenemos datos
        if (!historicalDataAnode?.results || !historicalDataCathode?.results) return;

        const anodeData = parseDataInflux(historicalDataAnode.results);
        const cathodeData = parseDataInflux(historicalDataCathode.results);

        // Procesar etiquetas de tiempo
        const timeArray = [];
        for (const key in historicalDataAnode.results) {
            const { time } = historicalDataAnode.results[key];
            const date = new Date(time);
            timeArray.push(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }));
        }
        let uniqueTimeArray = [...new Set(timeArray)]

        // Actualizar estado centralizado para el gráfico
        setChartData({
            anodeData,
            cathodeData,
            timeLabels: timeArray
        });

    }, [historicalDataAnode, historicalDataCathode]);

    useEffect(() => {
        if (chartRef.current && chartRef.current.getEchartsInstance) {
            const chartInstance = chartRef.current.getEchartsInstance();
            chartInstance?.setOption({
                animation: false,
                xAxis: {
                    data: chartData.timeLabels
                },
                series: [
                    {
                        data: chartData.anodeData
                    },
                    {
                        data: chartData.cathodeData
                    }
                ]
            });
        }
    }, [chartData]);

    const etiquetas = chartData.timeLabels;

    const params = {
        title: {
            text: 'Caudal',
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
                interval: "5",
                rotate: 45
            },
        },
        yAxis: {
            type: 'value',
            name: 'L/min'
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "15%",
            top: "15%",
            containLabel: true
        },
        legend: {
            data: ["Ánodo", "Cátodo"],
            bottom: 0
        },
    };

    const series = [
        {
            name: 'Ánodo',
            data: chartData.anodeData,
            smooth: true,
            showSymbol: false,
            color: '#00FFFF'
        },
        {
            name: 'Cátodo',
            data: chartData.cathodeData,
            smooth: true,
            showSymbol: false,
            color: '#000080'
        },
    ];

    const isLoading = isLoadingAnode || isLoadingCathode;
    if (isLoading) return <div className="text-center">Cargando datos...</div>;

    if (errorAnode || errorCathode) {
        console.error("Error cargando datos:", errorAnode || errorCathode);
    }

    return (
        <LineChart
            ref={chartRef}
            params={params}
            series={series}
        />
    );
}