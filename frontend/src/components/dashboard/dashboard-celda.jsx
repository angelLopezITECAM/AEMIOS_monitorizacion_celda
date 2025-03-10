import { TemperatureDistributionChart } from "./chart/celda/TemperatureDistributionChart";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCelda() {
    return <>
        <h3 className="text-lg text-gray-950 font-medium m-2">Dashboard - Celda AEM</h3>

        <div className="grid grid-cols-1 grid-rows-1 max-h-[85vh] h-[85vh] m-2">

            <Card className="col-span-1 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>Distribución de temperatura interna</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <TemperatureDistributionChart />
                </CardContent>
            </Card>


        </div>
    </>
}