"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

export function HeatmapChart() {
    const chartRef = useRef(null)

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current)
            const hours = ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"]
            const days = ["Sensor 1", "Sensor 2", "Sensor 3", "Sensor 4", "Sensor 5"]

            const data = [
                [0, 0, 25],
                [0, 1, 26],
                [0, 2, 27],
                [0, 3, 28],
                [0, 4, 29],
                [1, 0, 26],
                [1, 1, 27],
                [1, 2, 28],
                [1, 3, 29],
                [1, 4, 30],
                [2, 0, 27],
                [2, 1, 28],
                [2, 2, 29],
                [2, 3, 30],
                [2, 4, 31],
                [3, 0, 28],
                [3, 1, 29],
                [3, 2, 30],
                [3, 3, 31],
                [3, 4, 32],
                [4, 0, 29],
                [4, 1, 30],
                [4, 2, 31],
                [4, 3, 32],
                [4, 4, 33],
            ].map((item) => [item[1], item[0], item[2]])

            const option = {
                tooltip: {
                    position: "top",
                    formatter: (params) => `Temperatura: ${params.data[2]}°C`,
                },
                grid: {
                    left: "5%",
                    right: "5%",
                    top: "5%",
                    bottom: "25%",
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    data: hours,
                    splitArea: {
                        show: true,
                    },
                },
                yAxis: {
                    type: "category",
                    data: days,
                    splitArea: {
                        show: true,
                    },
                },
                visualMap: {
                    min: 25,
                    max: 35,
                    calculable: true,
                    orient: "horizontal",
                    left: "center",
                    bottom: "15%",
                },
                series: [
                    {
                        name: "Temperature",
                        type: "heatmap",
                        data: data,
                        label: {
                            show: true,
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                        },
                    },
                ],
            }

            chart.setOption(option)
        }
    }, [])

    return <div ref={chartRef} className="h-full w-full" />
}

