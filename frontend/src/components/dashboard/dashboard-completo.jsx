import { Actuadores } from "./actuadores";
import { Alertas } from "./alertas";
import Canvas from "./canvas";
import { TemperatureGraph } from "./chart/TemperatureChart";
import { WaterFlowAnodoChart } from "./chart/WaterFlowAnodoChart";
import { ElectricalRecordChart } from "./chart/ElectricalRecordChart";
import { ElectricalPotenciaChart } from "./chart/ElectricalPotenciaChart";
import { GasLevelsChart } from "./chart/GasLevelsChart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCompleto() {
    return <>
        <h3 className="text-lg text-gray-950 font-medium m-2">Dashboard - Ánodo</h3>

        <div className="grid grid-cols-3 grid-rows-2 max-h-[85vh] h-[85vh] m-2">

            <Card className="col-span-2 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>Caudal de entrada de H<sub>2</sub>O</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <WaterFlowAnodoChart />
                </CardContent>
            </Card>

            <Card className="col-span-1 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>Consumo eléctrico</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <WaterFlowAnodoChart />
                </CardContent>
            </Card>

            <Card className="col-span-1 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>Revoluciones por minuto</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <WaterFlowAnodoChart />
                </CardContent>
            </Card>

            <Card className="col-span-2 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>PPM de O<sub>2</sub></CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <WaterFlowAnodoChart />
                </CardContent>
            </Card>

        </div>
    </>
}