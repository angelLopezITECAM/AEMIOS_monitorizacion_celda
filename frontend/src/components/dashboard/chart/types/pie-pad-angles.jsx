"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"


export function PiePadAnglesChart({ params }) {
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null)

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current)
            chartInstanceRef.current = chart

            const option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        padAngle: 5,
                        itemStyle: {
                            borderRadius: 10
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: params.data
                    }
                ]
            };


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

