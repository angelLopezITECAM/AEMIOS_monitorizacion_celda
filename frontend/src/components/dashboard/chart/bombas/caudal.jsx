"use client"
import { LineChart } from "../types/line"

export function CaudalBombas() {

    const dataAnodo = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100 + 50))
    const dataCatodo = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100 + 50))

    const params = {
        xAxis: {
            type: "category",
            data: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            boundaryGap: false,
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                data: dataAnodo,
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                },
                color: "#00FFFF"
            },
            {
                data: dataCatodo,
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                },
                color: "#000080"
            },
        ],
    }
    return <LineChart params={params} />

}

