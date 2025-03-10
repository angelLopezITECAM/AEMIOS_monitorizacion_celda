import { HidrogenoLevelsChart } from "./chart/catodo/HidrogenoLevelsChart";
import { WaterFlowCatodoChart } from "./chart/catodo/WaterFlowCatodoChart";
import { ElectricalConsumoChart } from "./chart/catodo/ElectricalConsumoChart";
import { RevolucionesMinutoBomba } from "./chart/catodo/RevolucionesMinutoBomba";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCatodo() {
    return <>
        <h3 className="text-lg text-gray-950 font-medium m-2">Dashboard - Cátodo</h3>

        <div className="grid grid-cols-3 grid-rows-2 max-h-[85vh] h-[85vh] m-2">

            <Card className="col-span-2 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>Caudal de entrada de H<sub>2</sub>O</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <WaterFlowCatodoChart />
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

            <Card className="col-span-1 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>Revoluciones por minuto</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <RevolucionesMinutoBomba />
                </CardContent>
            </Card>

            <Card className="col-span-2 row-span-1 rounded-none">
                <CardHeader>
                    <CardTitle>PPM de H<sub>2</sub></CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <HidrogenoLevelsChart />
                </CardContent>
            </Card>

        </div>
    </>
}