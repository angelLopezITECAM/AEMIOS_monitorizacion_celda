
import { ElectricalConsumoPotencia } from "./chart/intensidad/ElectricalConsumoPotencia";
import { ElectricalConsumoChart } from "./chart/intensidad/ElectricalConsumoChart";
import { IntensidadVoltajeChart } from "./chart/intensidad/IntensidadVoltajeChart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardIntensidad() {
    return <>
        <h3 className="text-lg text-gray-950 font-medium m-2">Dashboard - Intensidad - Voltaje</h3>

        <div className="grid grid-cols-3 grid-rows-2 max-h-[85vh] h-[85vh] m-2">

            <Card className="col-span-3 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>Datos de intensidad y voltaje</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <IntensidadVoltajeChart />
                </CardContent>
            </Card>

            <Card className="col-span-2 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>Consumo eléctrico potenciostato</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <ElectricalConsumoPotencia />
                </CardContent>
            </Card>

            <Card className="col-span-1 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>Consumo eléctrico</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <ElectricalConsumoChart />
                </CardContent>
            </Card>

        </div>
    </>
}