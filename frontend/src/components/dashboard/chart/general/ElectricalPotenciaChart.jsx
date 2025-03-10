"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown } from "lucide-react"

export function ElectricalPotenciaChart() {
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null)

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current)
            chartInstanceRef.current = chart

            const option = {
                grid: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                xAxis: {
                    type: "category",
                    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    show: false,
                },
                yAxis: {
                    type: "value",
                    show: false,
                },
                series: [
                    {
                        data: [380, 350, 325, 300, 280, 260, 240],
                        type: "line",
                        smooth: true,
                        symbol: "none",
                        lineStyle: {
                            color: "#4318FF",
                            width: 2,
                        },
                        areaStyle: {
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: "rgba(67, 24, 255, 0.2)",
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(67, 24, 255, 0)",
                                    },
                                ],
                            },
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

    return (
        <Card className="col-span-1 row-span-1 overflow-auto rounded-none">
            <CardHeader>
                <CardTitle>Potencia eléctrica</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold">28W</span>
                        <span className="flex items-center text-xs text-red-600 font-medium">
                            <ArrowDown className="h-4 w-4" />
                            35%
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">comparado con la semana anterior</p>
                </div>
                <div className="h-full mt-4" ref={chartRef} />
            </CardContent>
        </Card>
    )
}

