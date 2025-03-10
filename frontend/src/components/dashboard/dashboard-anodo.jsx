
import { WaterFlowAnodoChart } from "./chart/anodo/WaterFlowAnodoChart";
import { ElectricalConsumoChart } from "./chart/anodo/ElectricalConsumoChart";
import { OxigenoLevelsChart } from "./chart/anodo/OxigenoLevelsChart";
import { RevolucionesMinutoBomba } from "./chart/anodo/RevolucionesMinutoBomba";
import { CorrelationWaterGasChart } from "./chart/anodo/CorrelationWaterGasChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardAnodo() {
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
                    <CardTitle>PPM de O<sub>2</sub></CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <OxigenoLevelsChart />
                </CardContent>
            </Card>

        </div>
    </>
}