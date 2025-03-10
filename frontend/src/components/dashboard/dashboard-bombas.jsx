
import { ConsumoBombas } from './chart/bombas/consumo';
import { PotenciaBombas } from './chart/bombas/potencia';
import { VoltajeBombas } from './chart/bombas/voltaje';
import { CaudalBombas } from './chart/bombas/caudal';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Title } from '@/components/ui/itecam/typography';

const classModules = "rounded-3xl border border-gray-200 bg-white p-4 m-2"
export function DashboardBombas() {
    return (
        <>
            <Title size="lg">Dashboard - Bombas ánodo y cátodo</Title>

            <div className="grid grid-cols-6 grid-rows-4 gap-2 max-h-[80vh] h-[80vh] m-2">

                <Card className={`col-span-2 row-span-2 ${classModules}`}>
                    <CardHeader>
                        <CardTitle>Consumo (vWh)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <ConsumoBombas />
                    </CardContent>
                </Card>

                <Card className={`col-span-2 row-span-2 col-start-3 ${classModules}`}>
                    <CardHeader>
                        <CardTitle>Potencia (W)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <PotenciaBombas />
                    </CardContent>
                </Card>

                <Card className={`col-span-2 row-span-2 col-start-5 ${classModules}`}>
                    <CardHeader>
                        <CardTitle>Voltaje (V)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <VoltajeBombas />
                    </CardContent>
                </Card>

                <Card className={`col-span-6 row-span-2 row-start-3 ${classModules}`}>
                    <CardHeader>
                        <CardTitle>Caudal (l)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <CaudalBombas />
                    </CardContent>
                </Card>

            </div>
        </>
    )
}