"use client"

import { BarVerticalChart } from "../types/bar-vertical"

export function HidrogenoLevelsChart() {

    const data = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100 + 50))

    const params = {
        legend: {
            show: false
        },
        xAxis: {
            type: "category",
            data: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
        },
        yAxis: {
            type: "value",
            max: Math.max(...data),
        },
        series: [
            {
                name: "Hidrógeno",
                type: "bar",
                data: data,
                color: "#fcc800",
                itemStyle: {
                    borderRadius: [10, 10, 0, 0],
                }
            },
        ]
    }

    return <BarVerticalChart params={params} />

}

