"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

export function TemperatureGraph() {
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null)

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current)
            chartInstanceRef.current = chart


            const option = {
                grid: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 5,
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    data: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
                    boundaryGap: false,
                },
                yAxis: {
                    type: "value",
                    min: 0,
                    max: 30,
                },
                series: [
                    {
                        data: [3, 6, 9, 1, 12, 20, 14, 8, 10, 3, 5, 8],
                        type: "line",
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 8,
                        lineStyle: {
                            width: 3,
                        },
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

