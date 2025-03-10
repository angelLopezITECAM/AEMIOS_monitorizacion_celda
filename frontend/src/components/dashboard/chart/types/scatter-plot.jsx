"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"


export function ScatterPlotChart({ params }) {
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null)

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current)
            chartInstanceRef.current = chart

            const option = {
                grid: {
                    left: "5%",
                    right: "5%",
                    top: "5%",
                    bottom: "5%",
                    containLabel: true,
                },
                xAxis: params.xAxis,
                yAxis: params.yAxis,
                tooltip: params.tooltip,
                series: params.series,
                itemStyle: params.itemStyle
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

    return (
        <div className="h-full" ref={chartRef} />
    )
}

