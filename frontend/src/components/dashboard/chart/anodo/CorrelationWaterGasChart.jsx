"use client"

export function CorrelationWaterGasChart() {

    const data = Array.from({ length: 50 }, () => [
        Math.random() * 100 + 50, // Caudal H2O (50-150 L/h)
        Math.random() * 20 + 10, // Concentración O2 (10-30%)
    ])

    const params = {
        tooltip: {
            trigger: "item",
            formatter: (params) =>
                `Caudal H2O: ${params.value[0].toFixed(2)} L/h<br>Concentración O2: ${params.value[1].toFixed(2)}%`,
        },
        series: [
            {
                symbolSize: 10,
                itemStyle: {
                    color: "#05df72"
                },
                type: 'scatter',
                data: data,
            }
        ],
        xAxis: {
            type: "value",
            name: "Caudal H2O (L/h)",
        },
        yAxis: {
            type: "value",
            name: "Concentración O2 (%)",
        },

    }

    return <ScatterPlotChart params={params} />
}

