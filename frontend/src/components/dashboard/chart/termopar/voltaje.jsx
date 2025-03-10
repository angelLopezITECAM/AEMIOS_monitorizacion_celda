"use client"
import { LineChart } from "../types/line"

export function VoltajeTermopar() {

    const data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100 + 50))

    console.log(data)

    const params = {
        xAxis: {
            type: "category",
            data: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            boundaryGap: false,
        },
        yAxis: {
            type: "value",
            min: 0,
            max: Math.max(...data),
        },
        series: [
            {
                data: data,
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                },
                color: "#40E0D0"
            },
        ],
    }
    return <LineChart params={params} />

}

