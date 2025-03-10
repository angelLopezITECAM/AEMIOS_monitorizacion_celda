"use client"

import { BarHorizontalChart } from "../types/bar-horizontal"

export function WaterFlowAnodoChart() {

    const data = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100 + 50))

    const params = {
        legend: ["Caudal H20"],
        series: [
            {
                name: "Caudal H20",
                type: "bar",
                data: data,
                itemStyle: {
                    color: "#51a2ff",
                    borderRadius: [0, 10, 10, 0],
                },
                barWidth: "60%",
            },
        ],
        xAxis: {
            type: "value",
            name: "Caudal (L/h)",
        },
        yAxis: {
            type: "category",
            data: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
            axisLabel: {
                interval: 0,
                rotate: 0,
            },
        },
    }

    return <BarHorizontalChart params={params} />
}

