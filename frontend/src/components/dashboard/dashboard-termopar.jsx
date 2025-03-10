
import { ConsumoTermopar } from './chart/termopar/consumo';
import { PotenciaTermopar } from './chart/termopar/potencia';
import { VoltajeTermopar } from './chart/termopar/voltaje';
import { TemperaturaTermopar } from './chart/termopar/temperatura';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Title } from '@/components/ui/itecam/typography';

const classModules = "rounded-3xl border border-gray-200 bg-white p-4 m-2"
export function DashboardTermopar() {
    return (
        <>
            <Title size="lg">Dashboard - Termopar</Title>
            <div className="grid grid-cols-6 grid-rows-4 gap-4 max-h-[80vh] h-[80vh] m-2">


                <Card className={`col-span-2 row-span-2 ${classModules}`}>
                    <CardHeader>
                        <CardTitle>Consumo (vWh)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <ConsumoTermopar />
                    </CardContent>
                </Card>

                <Card className={`col-span-2 row-span-2 col-start-3 ${classModules}`}>
                    <CardHeader>
                        <CardTitle>Potencia (W)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <PotenciaTermopar />
                    </CardContent>
                </Card>

                <Card className={`col-span-2 row-span-2 col-start-5 ${classModules}`}>
                    <CardHeader>
                        <CardTitle>Voltaje (V)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <VoltajeTermopar />
                    </CardContent>
                </Card>

                <Card className={`col-span-6 row-span-2 row-start-3 ${classModules}`}>
                    <CardHeader>
                        <CardTitle>Temperatura (ºC)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        <TemperaturaTermopar />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}