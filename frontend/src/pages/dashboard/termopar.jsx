
import { TimeFilterProvider, TimeFilter } from '@/context/filter-time-context';
import { MQTTProvider } from '@/context/mqtt-context';

import { ConsumoTermoparChart } from '@/components/charts/content/termopar/consumo-termopar';
import { IntensidadTermoparChart } from '@/components/charts/content/termopar/intensidad-termopar';
import { PotenciaTermoparChart } from '@/components/charts/content/termopar/potencia-termopar';
import { VoltajeTermoparChart } from '@/components/charts/content/termopar/voltaje-termopar';
import { TemperaturaTermoparChart } from '@/components/charts/content/termopar/temperatura-termopar';

export function PageDashboardTermopar() {
    return (
        <TimeFilterProvider>
            <MQTTProvider>

                <div className="flex items-center justify-between my-2 ">
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard - Termopar</h1>
                    <TimeFilter />
                </div>

                <div className="grid grid-cols-6 grid-rows-4 gap-4 max-h-[80vh] h-[80vh] ">

                    <div className='col-span-2 row-span-2 border border-gray-200 rounded-3xl p-4'>
                        <IntensidadTermoparChart />
                    </div>
                    <div className='col-span-2 row-span-2 col-start-3 border border-gray-200 rounded-3xl p-4'>
                        <PotenciaTermoparChart />
                    </div>
                    <div className='col-span-2 row-span-2 col-start-5 border border-gray-200 rounded-3xl p-4'>
                        <VoltajeTermoparChart />
                    </div>

                    <div className='col-span-6 row-span-2 row-start-3 border border-gray-200 rounded-3xl p-4'>
                        <TemperaturaTermoparChart />
                    </div>

                </div>

            </MQTTProvider>
        </TimeFilterProvider>
    )

}