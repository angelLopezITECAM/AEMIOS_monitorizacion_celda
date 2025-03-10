"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

export function WaterFlowChart() {
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null)

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current)
            chartInstanceRef.current = chart

            const option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "#6a7985",
                        },
                    },
                },
                grid: {
                    left: "5%",
                    right: "5%",
                    top: "5%",
                    bottom: "5%",
                    containLabel: true,
                },
                legend: {
                    show: false
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        name: "Canal Izquierdo",
                        type: "line",
                        areaStyle: {},
                        emphasis: {
                            focus: "series",
                        },
                        data: [120, 132, 101, 134, 90, 230, 210, 180],
                    },
                    {
                        name: "Canal Derecho",
                        type: "line",
                        areaStyle: {},
                        emphasis: {
                            focus: "series",
                        },
                        data: [220, 182, 191, 234, 290, 330, 310, 230],
                    },
                ],
            }

            chart.setOption(option)

            const handleResize = () => {
                chart.resize()
            }

            window.addEventListener("resize", handleResize)

            return () => {
                chart.dispose()
                window.removeEventListener("resize", handleResize)
            }
        }
    }, [])

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.resize()
            }
        })

        if (chartRef.current) {
            resizeObserver.observe(chartRef.current)
        }

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return <div ref={chartRef} className="p-4 w-full h-full" />
}

