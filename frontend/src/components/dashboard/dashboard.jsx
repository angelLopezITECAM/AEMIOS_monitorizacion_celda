import { Actuadores } from "./actuadores";
import { Alertas } from "./alertas";
import Canvas from "./canvas";
import { TemperatureGraph } from "./chart/general/TemperatureChart";
import { WaterFlowChart } from "./chart/general/WaterFlowChart";
import { ElectricalRecordChart } from "./chart/general/ElectricalRecordChart";
import { ElectricalPotenciaChart } from "./chart/general/ElectricalPotenciaChart";
import { GasLevelsChart } from "./chart/general/GasLevelsChart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Dashboard() {
    return <>
        <h3 className="text-lg text-gray-950 font-medium m-2">Dashboard - General</h3>

        <div className="grid grid-cols-6 grid-rows-4 max-h-[85vh] h-[85vh] m-2">

            <ElectricalRecordChart />

            <Card className="col-span-3 row-span-2 rounded-none">
                <CardHeader>
                    <CardTitle>Monitor</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <Canvas />
                </CardContent>
            </Card>

            <Card className="col-span-1 row-span-2 overflow-auto rounded-none">
                <CardHeader>
                    <CardTitle>Panel de control</CardTitle>
                </CardHeader>
                <CardContent>
                    <Actuadores />
                </CardContent>
            </Card>

            <Card className="col-span-1 row-span-2 overflow-auto rounded-none">
                <CardHeader>
                    <CardTitle>Alertas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alertas />
                </CardContent>
            </Card>

            <ElectricalPotenciaChart />

            <Card className="col-span-2 row-span-2 rounded-none">
                <CardHeader>
                    <CardTitle>Temperatura celda AEM</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <TemperatureGraph />
                </CardContent>
            </Card>

            <Card className="col-span-2 row-span-2 rounded-none">
                <CardHeader>
                    <CardTitle>Ciclo agua ánodo y cátodo</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <WaterFlowChart />
                </CardContent>
            </Card>


            <Card className="col-span-2 row-span-2 rounded-none">
                <CardHeader>
                    <CardTitle>PPM</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <GasLevelsChart />
                </CardContent>
            </Card>

        </div>
    </>
}