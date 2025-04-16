// src/components/charts/GenericLineChart.jsx
import React, { useRef } from 'react';
import { LineChart } from '@/components/charts/types/line';
import { useChartData } from '@/hooks/use-chart-data';

/**
 * Componente de gráfico de línea genérico.
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.title="Gráfico"] - Título del gráfico.
 * @param {string} [props.seriesName="Serie"] - Nombre de la serie.
 * @param {string} [props.yAxisLabel=""] - Etiqueta del eje Y.
 * @param {string} [props.color="#40E0D0"] - Color de la línea.
 * @param {string} props.magnitude - Magnitud para consultar y filtrar datos.
 * @param {number} [props.fixedValue] - Valor fijo para cada dato (opcional).
 * @param {Function} [props.processValue] - Función para procesar cada valor (opcional).
 */
export function GenericLineChart({
    title = 'Gráfico',
    seriesName = 'Serie',
    yAxisLabel = '',
    color = "#40E0D0",
    magnitude,
    fixedValue,
    processValue
}) {
    const chartRef = useRef(null);
    const chartData = useChartData({ magnitude, fixedValue, processValue });

    const params = {
        animation: false,
        title: {
            text: title,
            left: 'center'
        },
        tooltip: {
            trigger: "axis"
        },
        grid: {
            left: "5%",
            right: "4%",
            bottom: "5%",
            top: "15%",
            containLabel: true
        },
        xAxis: {
            type: "category",
            data: chartData.timeLabels,
            boundaryGap: false,
            axisLabel: {
                interval: "5",
                rotate: 45
            },
            axisLine: { onZero: false }
        },
        yAxis: {
            type: "value",
            name: yAxisLabel
        },
        series: [
            {
                name: seriesName,
                data: chartData.data,
                type: "line",
                smooth: true,
                showSymbol: false,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: { width: 3 },
                color: color
            }
        ]
    };

    return (
        <LineChart
            ref={chartRef}
            params={params}
            series={params.series}
        />
    );
}
