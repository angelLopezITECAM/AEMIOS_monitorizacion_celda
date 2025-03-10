"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

export function BarHorizontalChart({ params }) {
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
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                    },
                },
                legend: {
                    /* data: params.legend,
                    top: "bottom", */
                    show: false
                },
                xAxis: params.xAxis,
                yAxis: params.yAxis,
                series: params.series
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

    return <div ref={chartRef} className="w-full h-full" />
}

