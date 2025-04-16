import React, { useRef } from 'react';
import { LineChart } from '@/components/charts/types/line';
import { useMultiSeriesChartData } from '@/hooks/use-multiseries-chart-data';

export function GenericMultiLineChart({
    title = 'Gráfico',
    yAxisLabel = '',
    seriesConfigs
}) {
    const chartRef = useRef(null);

    const {
        seriesData,
        timeLabels,
        isLoading,
        error
    } = useMultiSeriesChartData(seriesConfigs);

    if (isLoading) return <div className="text-center">Cargando datos...</div>;
    if (error) return <div className="text-center">Error cargando datos.</div>;

    const params = {
        animation: false,
        title: { text: title, left: 'center' },
        tooltip: { trigger: "axis" },
        grid: {
            left: "5%", right: "4%", bottom: "15%", top: "15%", containLabel: true
        },
        xAxis: {
            type: "category",
            data: timeLabels,
            boundaryGap: false,
            axisLabel: { interval: "5", rotate: 45 },
            axisLine: { onZero: false }
        },
        yAxis: { type: "value", name: yAxisLabel },
        legend: {
            data: seriesConfigs.map(s => s.seriesName),
            bottom: 0
        },
        series: seriesConfigs.map((config, index) => ({
            name: config.seriesName,
            data: seriesData[index],
            type: "line",
            smooth: true,
            showSymbol: false,
            symbol: "circle",
            symbolSize: 8,
            lineStyle: { width: 3 },
            color: config.color
        }))
    };

    return (
        <LineChart
            ref={chartRef}
            params={params}
            series={params.series}
        />
    );
}
