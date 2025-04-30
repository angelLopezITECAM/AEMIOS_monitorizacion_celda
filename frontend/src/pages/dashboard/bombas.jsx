
import { TimeFilterProvider, TimeFilter } from '@/context/filter-time-context';
import { MqttProvider } from '@/context/mqtt-context';

import { ConsumoBombasChart } from '@/components/charts/content/bombas/consumo-bombas';
import { IntensidadBombasChart } from '@/components/charts/content/bombas/intensidad-bombas';
import { PotenciaBombasChart } from '@/components/charts/content/bombas/potencia-bombas';
import { VoltajeBombasChart } from '@/components/charts/content/bombas/voltaje-bombas';
import { CaudalBombasChart } from '@/components/charts/content/bombas/caudal-bombas';

export function PageDashboardBombas() {
    return (
        <TimeFilterProvider>
            <MqttProvider>

                <div className="flex items-center justify-between my-2 ">
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard - Bombas ánodo y cátodo</h1>
                    <TimeFilter />
                </div>

                <div className="grid grid-cols-6 grid-rows-4 gap-4 max-h-[80vh] h-[80vh] ">

                    <div className='col-span-2 row-span-2 border border-gray-200 rounded-3xl p-4'>
                        <IntensidadBombasChart />
                    </div>
                    <div className='col-span-2 row-span-2 col-start-3 border border-gray-200 rounded-3xl p-4'>
                        <PotenciaBombasChart />
                    </div>
                    <div className='col-span-2 row-span-2 col-start-5 border border-gray-200 rounded-3xl p-4'>
                        <VoltajeBombasChart />
                    </div>

                    <div className='col-span-6 row-span-2 row-start-3 border border-gray-200 rounded-3xl p-4'>
                        <CaudalBombasChart />
                    </div>

                </div>
            </MqttProvider>
        </TimeFilterProvider>
    )

}